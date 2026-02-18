// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import axios from "axios";

// const SellOrders = () => {
//   const [allSellOrders, setAllSellOrders] = useState([]);

//   useEffect(() => {
//     // Fetch all sell orders from backend
//     axios
//       .get("http://localhost:4000/sellOrder") // backend endpoint
//       .then((res) => {
//         console.log("Sell Orders fetched:", res.data);
//         setAllSellOrders(res.data);
//       })
//       .catch((err) => {
//         console.error("Error fetching sell orders:", err);
//       });
//   }, []);

//   return (
//     <div className="orders">
//       {allSellOrders.length > 0 ? (
//         <div className="order-table">
//           <table>
//             <thead>
//               <tr>
//                 <th>Product</th>
//                 <th>Qty.</th>
//                 <th>Price</th>
//                 <th>Mode</th>
//               </tr>
//             </thead>
//             <tbody>
//               {allSellOrders.map((order, index) => (
//                 <tr key={index}>
//                   <td>{order.name}</td>
//                   <td>{order.qty}</td>
//                   <td>{order.price.toFixed(2)}</td>
//                   <td>{order.mode}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="no-orders">
//           <p>You haven't placed any sell orders today</p>
//           <Link to="/" className="btn">
//             Get started
//           </Link>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SellOrders;
