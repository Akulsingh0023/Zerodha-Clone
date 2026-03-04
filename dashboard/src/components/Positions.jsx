import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../config";
import SellActionWindow from "./SellActionWindow";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);
  const [sellStock, setSellStock] = useState(null);

  const fetchPositions = async () => {
    const res = await axios.get(`${BASE_URL}/positions`);
    setAllPositions(res.data);
    updateWithLivePrice(res.data);
  };

  useEffect(() => {
    fetchPositions();

    const onWalletUpdated = () => fetchPositions();
    window.addEventListener("walletUpdated", onWalletUpdated);

    const interval = setInterval(fetchPositions, 5000);
    return () => {
      window.removeEventListener("walletUpdated", onWalletUpdated);
      clearInterval(interval);
    };
  }, []);

  const updateWithLivePrice = async (positions) => {
    const updated = await Promise.all(
      positions.map(async (stock) => {
        try {
          const res = await axios.get(
            `http://localhost:4000/api/live-price/${stock.name}`
          );
          const { ltp, changePercent } = res.data;
          return {
            ...stock,
            price: ltp,
            day: `${changePercent.toFixed(2)}%`,
            isLoss: changePercent < 0,
          };
        } catch {
          return stock;
        }
      })
    );

    setAllPositions(updated);
  };

  const openSellWindow = (stock) => {
    if (!stock) return;
    setSellStock({
      name: stock.name,
      qty: Number(stock.qty) || 0,
      price: Number(stock.price) || 0,
      product: "MIS",
    });
  };

  return (
    <>
      <h3 className="title">Positions ({allPositions.length})</h3>

      <div className="order-table">
        <table className="positions-table">
          <thead>
            <tr>
              <th className="align-left">Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&amp;L</th>
              <th>Day Chg.</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {allPositions.map((stock, index) => {
              const ltp = Number(stock.price) || 0;
              const qty = Number(stock.qty) || 0;
              const avg = Number(stock.avg) || 0;
              const pnl = (ltp - avg) * qty;
              const profClass = pnl >= 0 ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td className="stock-name align-left">{stock.name}</td>
                  <td className="quantity">{qty}</td>
                  <td>{avg.toFixed(2)}</td>
                  <td>{ltp.toFixed(2)}</td>
                  <td className={profClass}>
                    {pnl >= 0 ? "+" : ""}
                    {pnl.toFixed(2)}
                  </td>
                  <td className={dayClass}>{stock.day}</td>
                  <td>
                    <button
                      type="button"
                      className="sell"
                      onClick={() => openSellWindow(stock)}
                    >
                      Sell
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sellStock && (
        <SellActionWindow
          stock={sellStock}
          closeSellWindow={() => setSellStock(null)}
        />
      )}
    </>
  );
};

export default Positions;

// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const Positions = () => {
//   const [allPositions, setAllPositions] = useState([]);

//   useEffect(() => {
//     const fetchPositions = async () => {
//       try {
//         const res = await axios.get("
//http://localhost:4000/allPositions");

//         const updated = await Promise.all(
//           res.data.map(async (stock) => {
//             try {
//               const priceRes = await axios.get(
//                 `
//http://localhost:4000/api/live-price/${stock.name}`
//               );

//               const { ltp, changePercent } = priceRes.data;

//               const curValue = ltp * stock.qty;
//               const invested = stock.avg * stock.qty;
//               const pnl = curValue - invested;

//               return {
//                 ...stock,
//                 price: ltp,
//                 day: `${changePercent.toFixed(2)}%`,
//                 isLoss: changePercent < 0,
//               };
//             } catch {
//               return stock;
//             }
//           })
//         );

//         setAllPositions(updated);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchPositions();
//     const interval = setInterval(fetchPositions, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <>
//       <h3 className="title">Positions ({allPositions.length})</h3>

//       <div className="order-table">
//         <table>
//           <thead>
//             <tr>
//               <th>Product</th>
//               <th>Instrument</th>
//               <th>Qty</th>
//               <th>Avg</th>
//               <th>LTP</th>
//               <th>P&L</th>
//               <th>Day %</th>
//             </tr>
//           </thead>
//           <tbody>
//             {allPositions.map((stock, index) => {
//               const curValue = stock.price * stock.qty;
//               const pnl = curValue - stock.avg * stock.qty;
//               const profClass = pnl >= 0 ? "profit" : "loss";
//               const dayClass = stock.isLoss ? "loss" : "profit";

//               return (
//                 <tr key={index}>
//                   <td>{stock.product}</td>
//                   <td>{stock.name}</td>
//                   <td>{stock.qty}</td>
//                   <td>{stock.avg.toFixed(2)}</td>
//                   <td>{stock.price.toFixed(2)}</td>
//                   <td className={profClass}>
//                     {pnl.toFixed(2)}
//                   </td>
//                   <td className={dayClass}>{stock.day}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// };

// export default Positions;
