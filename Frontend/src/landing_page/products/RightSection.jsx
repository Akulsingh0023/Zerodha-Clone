import React from "react";

function RightSection({
  imageURL,
  productName,
  productDescription,
  learnMore,
}) {
  return (
    <div className="container mt-5 ">
      <div className="row landing-split product-section">
        <div className="col-6 p-5 mt-5 product-copy">
          <h1>{productName}</h1>
          <p>{productDescription}</p>
          <div>
            <a
              href={learnMore}
              className="product-link"
            >
              Learn more{" "}
              <i class="fa fa-long-arrow-right" aria-hidden="true"></i>
            </a>
          </div>
        </div>
        <div className="col-6 product-media">
          <img src={imageURL} alt="" />
        </div>
      </div>
    </div>
  );
}

export default RightSection;
