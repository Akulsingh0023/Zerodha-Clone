import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { squareOffUserPositions } from "../controllers/squareOffController.js";

const router = express.Router();

/**
 * POST /api/square-off
 * Manually trigger auto square-off for the authenticated user.
 * Called by frontend at 15:20 to ensure instant UI update.
 */
router.post("/", protect, async (req, res) => {
  try {
    const result = await squareOffUserPositions(req.user._id);

    if (result.squared === 0) {
      return res.json({
        success: true,
        message: "No open positions to square off",
        squared: 0,
        summary: [],
      });
    }

    return res.json({
      success: true,
      message: `${result.squared} position(s) auto squared off`,
      squared: result.squared,
      summary: result.summary,
    });
  } catch (err) {
    console.error("[Square-Off API] Error:", err.message);
    return res
      .status(500)
      .json({ success: false, message: "Auto square-off failed" });
  }
});

export default router;
