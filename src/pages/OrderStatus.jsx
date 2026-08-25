import React from "react";
import "../styles/OrderStatus.css";

const OrderStatus = () => {
  return (
    <>
        <div className="orderTracking_page">

      {/* Main Content */}
      <main className="orderTracking_main">

        {/* Page Heading */}
        <section className="orderTracking_headingSection">
          <h1 className="orderTracking_title">
            Order Tracking
          </h1>

          <p className="orderTracking_subtitle">
            Track your order in real-time and check its delivery status.
          </p>
        </section>

        {/* Order Card */}
        <section className="orderTracking_orderCard">

          {/* Order Summary */}
          <div className="orderTracking_orderSummary">

            <div className="orderTracking_summaryItem">
              <span className="orderTracking_summaryLabel">
                Order Number
              </span>

              <span className="orderTracking_summaryValue">
                KNZ45872
              </span>
            </div>

            <div className="orderTracking_summaryItem">
              <span className="orderTracking_summaryLabel">
                Order Date
              </span>

              <span className="orderTracking_summaryValue">
                May 18, 2024
              </span>
            </div>

            <div className="orderTracking_summaryItem">
              <span className="orderTracking_summaryLabel">
                Order Total
              </span>

              <span className="orderTracking_summaryValue">
                R2800
              </span>
            </div>

            <div className="orderTracking_summaryItem orderTracking_statusItem">
              <span className="orderTracking_summaryLabel">
                Status
              </span>

              <span className="orderTracking_statusBadge">
                In Transit
              </span>
            </div>

          </div>

          {/* Order Details */}
          <div className="orderTracking_details">

            {/* Delivery Details */}
            <div className="orderTracking_deliverySection">

              <h2 className="orderTracking_sectionTitle">
                Delivery Details
              </h2>

              <div className="orderTracking_deliveryItem">
                <div className="orderTracking_deliveryIcon">
                  ⌖
                </div>

                <div className="orderTracking_deliveryContent">
                  <h3 className="orderTracking_deliveryTitle">
                    Delivery Address
                  </h3>

                  <p className="orderTracking_deliveryText">
                    123 Sneaker Street
                    <br />
                    Cape Town, 8001
                    <br />
                    South Africa
                  </p>
                </div>
              </div>

              <div className="orderTracking_deliveryItem">
                <div className="orderTracking_deliveryIcon">
                  ▣
                </div>

                <div className="orderTracking_deliveryContent">
                  <h3 className="orderTracking_deliveryTitle">
                    Estimated Delivery
                  </h3>

                  <p className="orderTracking_deliveryText">
                    May 24, 2024
                  </p>
                </div>
              </div>

              <div className="orderTracking_deliveryItem">
                <div className="orderTracking_deliveryIcon">
                  ▱
                </div>

                <div className="orderTracking_deliveryContent">
                  <h3 className="orderTracking_deliveryTitle">
                    Shipping Method
                  </h3>

                  <p className="orderTracking_deliveryText">
                    Standard Delivery
                  </p>
                </div>
              </div>

            </div>

            {/* Order Items */}
            <div className="orderTracking_itemsSection">

              <h2 className="orderTracking_sectionTitle">
                Order Items
              </h2>

              {/* Product 1 */}
              <div className="orderTracking_product">

                <div className="orderTracking_productImage orderTracking_nikeImage">
                  <span className="orderTracking_productPlaceholder">
                    Nike
                  </span>
                </div>

                <div className="orderTracking_productInfo">
                  <h3 className="orderTracking_productName">
                    Nike Air Force 1
                  </h3>

                  <p className="orderTracking_productDetails">
                    Color: White
                    <span className="orderTracking_separator">•</span>
                    Size: 8
                  </p>

                  <p className="orderTracking_productPrice">
                    R1300
                  </p>
                </div>

                <div className="orderTracking_productQuantity">
                  Qty: 1
                </div>

                <div className="orderTracking_productTotal">
                  R1300
                </div>

              </div>

              {/* Product 2 */}
              <div className="orderTracking_product">

                <div className="orderTracking_productImage orderTracking_adidasImage">
                  <span className="orderTracking_productPlaceholder">
                    Adidas
                  </span>
                </div>

                <div className="orderTracking_productInfo">
                  <h3 className="orderTracking_productName">
                    Adidas Forum Low
                  </h3>

                  <p className="orderTracking_productDetails">
                    Color: White / Black
                    <span className="orderTracking_separator">•</span>
                    Size: 9
                  </p>

                  <p className="orderTracking_productPrice">
                    R1500
                  </p>
                </div>

                <div className="orderTracking_productQuantity">
                  Qty: 1
                </div>

                <div className="orderTracking_productTotal">
                  R1500
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* Back Button */}
        <button className="orderTracking_backButton">
          <span className="orderTracking_backArrow">
            ←
          </span>

          Back to Shopping
        </button>

      </main>



    </div>
    </>
  );
};

export default OrderStatus;