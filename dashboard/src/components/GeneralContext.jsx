// import React, { useState } from "react";

// import BuyActionWindow from "./BuyActionWindow";

// const GeneralContext = React.createContext({
//   openBuyWindow: (uid) => {},
//   closeBuyWindow: () => {},
// });

// export const GeneralContextProvider = (props) => {
//   const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
//   const [selectedStockUID, setSelectedStockUID] = useState("");

//   const handleOpenBuyWindow = (uid) => {
//     setIsBuyWindowOpen(true);
//     setSelectedStockUID(uid);
//   };

//   const handleCloseBuyWindow = () => {
//     setIsBuyWindowOpen(false);
//     setSelectedStockUID("");
//   };

//   return (
//     <GeneralContext.Provider
//       value={{
//         openBuyWindow: handleOpenBuyWindow,
//         closeBuyWindow: handleCloseBuyWindow,
//       }}
//     >
//       {props.children}
//       {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} />}
//     </GeneralContext.Provider>
//   );
// };

// export default GeneralContext;

import { createContext, useState } from "react";
import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";

const GeneralContext = createContext();

export const GeneralContextProvider = ({ children }) => {
  const [buyStock, setBuyStock] = useState(null);
  const [sellStock, setSellStock] = useState(null);

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: (stock) => setBuyStock(stock),
        openSellWindow: (stock) => setSellStock(stock),
      }}
    >
      {children}

      {buyStock && (
        <BuyActionWindow stock={buyStock} closeBuyWindow={() => setBuyStock(null)} />
      )}

      {sellStock && (
        <SellActionWindow
          stock={sellStock}
          closeSellWindow={() => setSellStock(null)}
        />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
