import React from "react";

function Hero() {
  return (
    <div className="container-fluid" id="supportHero">
      <div className="p-5" id="supportWrapper">
        <h4>Support Portal</h4>
        <a href="" className="me-5">Track Tickets</a>
      </div>
      <div className="row p-3 m-3 support-hero-row landing-split">
        <div className="col-6 p-5">
          <h1 className="fs-3 mb-4">
            Search for an answer or browse help topics to create a ticket
          </h1>
          <input
            type="text"
            placeholder="Eg: how do i activate F&O, why is my order getting rejected.."
          />
          <br />
       <div className="mt-3 ">
           <a href="">Track account opening</a>

          <a href="" className="ms-3"  >Track segment activation</a>

          <a href="" className="ms-3" >Intraday margins</a>
          <br />
          <a href="" className="ms-3">Kite user manual</a>
       </div>
        </div>
        <div className="col-1"></div>
        <div className="col-5 p-5">
          <h1 className="fs-3 ">Featured</h1>
          <ol>
            <li><a href="" style={{lineHeight:"3"}}>Current Takeovers and Delisting - January 2024</a></li>
            <li><a href="">Latest Intraday leverages - MIS & CO</a></li>
          </ol>
        </div>
      </div>
    </div>
  );
}

export default Hero;
