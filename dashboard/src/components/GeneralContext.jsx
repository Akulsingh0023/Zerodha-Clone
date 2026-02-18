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
  const [buyUID, setBuyUID] = useState(null);
  const [sellUID, setSellUID] = useState(null);

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: (uid) => setBuyUID(uid),
        openSellWindow: (uid) => setSellUID(uid),
      }}
    >
      {children}

      {buyUID && (
        <BuyActionWindow uid={buyUID} closeBuyWindow={() => setBuyUID(null)} />
      )}

      {sellUID && (
        <SellActionWindow
          uid={sellUID}
          closeSellWindow={() => setSellUID(null)}
        />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
