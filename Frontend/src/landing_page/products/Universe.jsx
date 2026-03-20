import React from "react";

function Universe() {
  return (
    <div className="container mt-5">
      <div className="row text-center universe-grid">
        <h1 className="mb-3">The Zerodha Universe</h1>
        <p>
          Extend your trading and investment experience even further with our
          partner platforms
        </p>

        <div className="col-4 p-3 mt-5">
          <img src="media/images/smallcaseLogo.png" alt=""  className="mb-3" style={{width:"50%"}}/>
          <p className="text-small text-muted">Thematic investing platform</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img src="media/images/streakLogo.png" alt=""  className="mb-3" style={{width:"40%"}}/>
          <p className="text-small text-muted">Algo & strategy platform</p>
        </div>
        <div className="col-4 p-3 mt-5">
          <img src="media/images/sensibullLogo.svg" alt=""  className="mb-3" style={{width:"50%"}}/>
          <p className="text-small text-muted">options trading platform</p>
        </div>
               <div className="col-4 p-3 mt-5">
          <img src="media/images/zerodhaFundhouse.png" alt=""  className="mb-3" style={{width:"50%"}}/>
          <p className="text-small text-muted">Asset management</p>
        </div>
        <div className="col-4 p-3 mt-5">
           <img src="media/images/goldenpiLogo.png" alt="" className="mb-3" style={{width:"50%"}}/>
          <p className="text-small text-muted">Bonds trading platform</p>
        </div>
        <div className="col-4 p-3 mt-5">
            <img src="media/images/dittoLogo.png" alt="" className="mb-3" style={{width:"30%"}}/>
          <p className="text-small text-muted">Insurance</p>
        </div>
      </div>
    </div>
  );
}

export default Universe;
