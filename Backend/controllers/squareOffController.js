import mongoose from "mongoose";
import PositionsModel from "../model/PositionsModel.js";
import OrdersModel from "../model/OrdersModel.js";
import WalletTransaction from "../model/WalletTransaction.js";
import User from "../model/User.js";

/**
 * Square off all open MIS positions for a single user.
 * Uses a mongoose session for atomicity.
 * Returns { success, summary } with P&L details.
 */
export const squareOffUserPositions = async (userId) => {
  const positions = await PositionsModel.find({ user: userId });
  if (positions.length === 0) return { success: true, squared: 0 };

  const session = await mongoose.startSession();
  const summary = [];

  try {
    await session.withTransaction(async () => {
      let totalPL = 0;

      for (const pos of positions) {
        const qty = Number(pos.qty);
        const buyPrice = Number(pos.avg);
        const currentPrice = Number(pos.price);
        const pnl = (currentPrice - buyPrice) * qty;
        totalPL += pnl;

        // Create AUTO SQUARE OFF order
        await OrdersModel.create(
          [
            {
              name: pos.name,
              qty,
              price: currentPrice,
              mode: "AUTO SQUARE OFF",
              product: "MIS",
              user: userId,
            },
          ],
          { session }
        );

        // Wallet transaction for the P&L
        const txnType = pnl >= 0 ? "credit" : "debit";
        const txnAmount = Math.abs(pnl);

        if (txnAmount > 0) {
          await WalletTransaction.create(
            [
              {
                userId,
                type: txnType,
                amount: txnAmount,
                reason: "auto_square_off",
              },
            ],
            { session }
          );
        }

        summary.push({
          name: pos.name,
          qty,
          buyPrice,
          currentPrice,
          pnl: +pnl.toFixed(2),
        });
      }

      // Update wallet balance with net P&L (can be positive or negative)
      if (totalPL !== 0) {
        await User.findByIdAndUpdate(
          userId,
          { $inc: { walletBalance: totalPL } },
          { session }
        );
      }

      // Remove all positions for this user
      await PositionsModel.deleteMany({ user: userId }, { session });
    });

    session.endSession();
    return { success: true, squared: positions.length, summary };
  } catch (err) {
    await session.abortTransaction().catch(() => {});
    session.endSession();
    throw err;
  }
};

/**
 * Square off all open MIS positions for ALL users.
 * Called by the backend scheduler at 15:20.
 */
export const squareOffAllUsers = async () => {
  // Find all users who have open positions
  const userIds = await PositionsModel.distinct("user");
  if (userIds.length === 0) {
    console.log("[Auto Square-Off] No open positions to square off.");
    return;
  }

  console.log(
    `[Auto Square-Off] Squaring off positions for ${userIds.length} user(s)...`
  );

  for (const userId of userIds) {
    try {
      const result = await squareOffUserPositions(userId);
      console.log(
        `[Auto Square-Off] User ${userId}: ${result.squared} position(s) squared off.`
      );
    } catch (err) {
      console.error(
        `[Auto Square-Off] Failed for user ${userId}:`,
        err.message
      );
    }
  }

  console.log("[Auto Square-Off] Completed.");
};
