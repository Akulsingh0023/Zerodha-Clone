import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../config";
import { VerticalGraph } from "./VerticalGraph";
import SellActionWindow from "./SellActionWindow";

const Holdings = () => {
  const [allHoldings, setAllHoldings] = useState([]);
  const [sellStock, setSellStock] = useState(null);

useEffect(() => {
  const fetchHoldings = async () => {
    const res = await axios.get(`${BASE_URL}/holdings`);
    setAllHoldings(res.data);

    // 🔥 live price attach
    updateWithLivePrice(res.data);
  };

  fetchHoldings();

  // 🔁 auto refresh every 5 sec
  const interval = setInterval(fetchHoldings, 5000);
  return () => clearInterval(interval);
}, []);

// 🔁 Live price + calculations (Zerodha logic)
const updateWithLivePrice = async (holdings) => {
  const updated = await Promise.all(
    holdings.map(async (stock) => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/live-price/${stock.name}`
        );

        const { ltp, changePercent } = res.data;

        const curValue = ltp * stock.qty;
        const invested = stock.avg * stock.qty;
        const pnl = curValue - invested;
        const net = ((pnl / invested) * 100).toFixed(2);

        return {
          ...stock,
          price: ltp,                 // 🔥 LTP update
          net: `${net}%`,              // 🔥 Net %
          day: `${changePercent.toFixed(2)}%`, // 🔥 Day %
          isLoss: changePercent < 0,
        };
      } catch (err) {
        return stock; // agar API fail ho to purana data
      }
    })
  );

  setAllHoldings(updated);
};


  // 📊 Graph
  const labels = allHoldings.map((stock) => stock.name);

  const data = {
    labels,
    datasets: [
      {
        label: "Current Value",
        data: allHoldings.map(
          (stock) => stock.qty * stock.price
        ),
        backgroundColor: "rgba(53, 162, 235, 0.6)",
      },
    ],
  };

  // 🔢 Totals (Zerodha logic)
  const totalInvestment = allHoldings.reduce(
    (sum, stock) => sum + stock.qty * stock.avg,
    0
  );

  const currentValue = allHoldings.reduce(
    (sum, stock) => sum + stock.qty * stock.price,
    0
  );

  const totalPL = currentValue - totalInvestment;
  const isProfit = totalPL >= 0;

  const openSellWindow = (stock) => {
    if (!stock) return;
    setSellStock({
      name: stock.name,
      qty: stock.qty,
      price: stock.price,
      product: "CNC",
    });
  };

  return (
    <>
     <h3 className="title">Holdings ({allHoldings.length})</h3>

      <div className="order-table">
        <table className="holdings-table">
          <thead>
            <tr>
              <th className="align-left">Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&amp;L</th>
              <th>Day chg.</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {allHoldings.map((stock, index) => {
              const ltp = Number(stock.price) || 0;
              const qty = Number(stock.qty) || 0;
              const avg = Number(stock.avg) || 0;

              const curValue = ltp * qty;
              const pnl = curValue - avg * qty;
              const profClass = pnl >= 0 ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td className="stock-name align-left">{stock.name}</td>
                  <td className="quantity">{qty}</td>
                  <td>{avg.toFixed(2)}</td>
                  <td>{ltp.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
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

      {/* 📌 SUMMARY (REAL DATA) */}
      <div className="row">
        <div className="col">
          <h5>₹{totalInvestment.toFixed(2)}</h5>
          <p>Total investment</p>
        </div>

        <div className="col">
          <h5>₹{currentValue.toFixed(2)}</h5>
          <p>Current value</p>
        </div>

        <div className="col">
          <h5 className={isProfit ? "profit" : "loss"}>
            {isProfit ? "+" : ""}₹{totalPL.toFixed(2)}
          </h5>
          <p>P&amp;L</p>
        </div>
      </div>

      <VerticalGraph data={data} />

      {sellStock && (
        <SellActionWindow
          stock={sellStock}
          closeSellWindow={() => setSellStock(null)}
        />
      )}
    </>
  );
};

export default Holdings;

// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { VerticalGraph } from "./VerticalGraph";

// const Holdings = () => {
//   const [allHoldings, setAllHoldings] = useState([]);

//   useEffect(() => {
//     const fetchAndUpdate = async () => {
//       try {
//         const res = await axios.get("http://localhost:4000/allHoldings");

//         const updated = await Promise.all(
//           res.data.map(async (stock) => {
//             try {
//               const priceRes = await axios.get(
//                 `http://localhost:4000/api/live-price/${stock.name}`
//               );

//               const { ltp, changePercent } = priceRes.data;

//               const curValue = ltp * stock.qty;
//               const invested = stock.avg * stock.qty;
//               const pnl = curValue - invested;
//               const net = ((pnl / invested) * 100).toFixed(2);

//               return {
//                 ...stock,
//                 price: ltp,
//                 net: `${net}%`,
//                 day: `${changePercent.toFixed(2)}%`,
//                 isLoss: changePercent < 0,
//               };
//             } catch {
//               return stock;
//             }
//           })
//         );

//         setAllHoldings(updated);
//       } catch (err) {
//         console.log(err);
//       }
//     };

//     fetchAndUpdate();
//     const interval = setInterval(fetchAndUpdate, 5000);

//     return () => clearInterval(interval);
//   }, []);

//   const labels = allHoldings.map((stock) => stock.name);

//   const data = {
//     labels,
//     datasets: [
//       {
//         label: "Current Value",
//         data: allHoldings.map(
//           (stock) => stock.qty * stock.price
//         ),
//         backgroundColor: "rgba(53, 162, 235, 0.6)",
//       },
//     ],
//   };

//   const totalInvestment = allHoldings.reduce(
//     (sum, stock) => sum + stock.qty * stock.avg,
//     0
//   );

//   const currentValue = allHoldings.reduce(
//     (sum, stock) => sum + stock.qty * stock.price,
//     0
//   );

//   const totalPL = currentValue - totalInvestment;
//   const isProfit = totalPL >= 0;

//   return (
//     <>
//       <h3 className="title">Holdings ({allHoldings.length})</h3>

//       <div className="order-table">
//         <table>
//           <thead>
//             <tr>
//               <th>Instrument</th>
//               <th>Qty.</th>
//               <th>Avg</th>
//               <th>LTP</th>
//               <th>Cur Val</th>
//               <th>P&L</th>
//               <th>Net %</th>
//               <th>Day %</th>
//             </tr>
//           </thead>
//           <tbody>
//             {allHoldings.map((stock, index) => {
//               const curValue = stock.price * stock.qty;
//               const pnl = curValue - stock.avg * stock.qty;
//               const profClass = pnl >= 0 ? "profit" : "loss";
//               const dayClass = stock.isLoss ? "loss" : "profit";

//               return (
//                 <tr key={index}>
//                   <td>{stock.name}</td>
//                   <td>{stock.qty}</td>
//                   <td>{stock.avg.toFixed(2)}</td>
//                   <td>{stock.price.toFixed(2)}</td>
//                   <td>{curValue.toFixed(2)}</td>
//                   <td className={profClass}>
//                     {pnl.toFixed(2)}
//                   </td>
//                   <td className={profClass}>{stock.net}</td>
//                   <td className={dayClass}>{stock.day}</td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       <VerticalGraph data={data} />

//       <div className="row">
//         <div className="col">
//           <h5>₹{totalInvestment.toFixed(2)}</h5>
//           <p>Total Investment</p>
//         </div>

//         <div className="col">
//           <h5>₹{currentValue.toFixed(2)}</h5>
//           <p>Current Value</p>
//         </div>

//         <div className="col">
//           <h5 className={isProfit ? "profit" : "loss"}>
//             ₹{totalPL.toFixed(2)}
//           </h5>
//           <p>Total P&L</p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Holdings;
