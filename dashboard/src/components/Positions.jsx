import React, { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "../config";

// import { positions } from "../data/data";
const Positions = () => {
    const [allpositions, setAllPositions] = useState([]);

  useEffect(() => {
    axios.get(`${BASE_URL}/allPositions`)
    .then((res) => {
      console.log(res.data);
      setAllPositions(res.data);
    });
  }, []);
  return (
    <>
      <h3 className="title">Positions ({allpositions.length})</h3>

      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Day Chg.</th>
            </tr>
            {allpositions.map((stock, index) => {
              const curValue = stock.price * stock.qty;
              const isProfit = curValue - stock.avg * stock.qty >= 0.0;
              const profClass = isProfit ? "profit" : "loss";
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr key={index}>
                  <td>{stock.product}</td>
                    <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td className={profClass}>
                    {(curValue - stock.avg * stock.qty).toFixed(2)}
                  </td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </thead>
        </table>
      </div>
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
