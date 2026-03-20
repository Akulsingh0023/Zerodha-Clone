import React from 'react'

function Pricing() {
  return (
   <div className="container">
    <div className="row landing-split pricing-section">
      <div className="col-4">
        <h1 className='mb-3 fs-2'>Unbeatable pricing</h1>
        <p>We pioneered the concept of discount broking and price transparency in India. Flat fees and no hidden charges.</p>
              <a href="" className='mx-4' style={{textDecoration:"none"}}>See Pricing<i class="fa fa-long-arrow-right" aria-hidden="true"></i></a>
      </div>
      <div className="col-2 pricing-spacer"></div>
      <div className="col-6 mb-5 pricing-cards">
        <div className="row text-center pricing-card-grid">
          <div className="col p-3 border">
            <h1 className='mb-3'>₹0</h1>
            <p>Free equity delivery and <br />
direct mutual funds</p>
          </div>
          <div className="col p-3 border">
            <h2 className='mb-3'>₹20</h2>
            <p>Intraday and F&O</p>
          </div>
        </div>
      </div>
    </div>
   </div>
  )
}

export default Pricing
