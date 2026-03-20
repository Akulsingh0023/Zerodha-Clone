import React from "react";

function LeftSection({
  imageURL,
  productName,
  productDescription,
  tryDemo,
  learnMore,
  googleplay,
  appStore,
}) {
  return (
    <div className="container mt-5">
      <div className="row landing-split product-section">
        <div className="col-6 product-media">
          <img src={imageURL} alt="" />
        </div>
        <div className="col-6 p-5 mt-5 product-copy">
          <h1>{productName}</h1>
          <p>{productDescription}</p>
          <div className="product-links">
            <a href={tryDemo} className="product-link">
              Try demo  <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
            </a>
            <a href={learnMore} className="product-link">
              Learn more  <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
            </a>
          </div>
          <div className="mt-3 product-badges">
            <a href={googleplay}><img src="media/images/googlePlayBadge.svg" alt="" /></a>
            <a href={appStore} className="product-badge-link"><img src="media/images/appstoreBadge.svg" alt="" /></a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LeftSection;
