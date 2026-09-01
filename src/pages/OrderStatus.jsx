import React, { useState, useEffect } from "react";
import "../styles/OrderStatus.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"

const OrderStatus = () => {

  // NAVIGATE USED TO MOVE BETWEN DIFFERENT PAGES
  const navigate = useNavigate();

  // USESTATE THAT WILL BE USED TO STORE ALL OF THE ORDERS THAT THE USER HAS MADE
  const [myOrders, setMyOrders] = useState();

  // USEEFFECT USE TO COLLECT ALL OF THE SHOES FROM THE CARTS COLLECTION
  useEffect(() => {

    const getAllDeliveries = async () => {

      try {

        const { accessTokenUserId, accessToken } = JSON.parse(sessionStorage.getItem("KicksNationz"));
        const response = await fetch(`//localhost:3000/deliverystatus/${accessTokenUserId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Basic ${accessToken}`
          }
        });

        const data = await response.json();

        console.log("Cart collected from the database", data.message);

        setMyOrders(() => { return data.message });

        console.log

        // const currentTotal =  data.message.reduce( (total,item)=>{
        //   return ( total + (item.quantity * item.price) )
        // },0 )
        // setPaymentTotal( ()=>{
        //    return ( currentTotal );
        // })

      } catch (error) {
        console.error("MyCartDisplay function: ", error);
      }
    }

    getAllDeliveries();

  }, [])

  return (
    <>
      <Navbar />
      <div className="orderTracking_page">

        {myOrders && myOrders.map((item, index) => {
          return (
            <main className="orderTracking_main" key={index}>

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
                      September 4, 2026
                    </span>
                  </div>

                  <div className="orderTracking_summaryItem">
                    <span className="orderTracking_summaryLabel">
                      Order Total
                    </span>

                    <span className="orderTracking_summaryValue">
                      R{item.totalPrice}
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


                      <div className="orderTracking_deliveryContent">
                        <h3 className="orderTracking_deliveryTitle">
                          Delivery Address
                        </h3>

                        <p className="orderTracking_deliveryText">
                          {item.shippingAddress}
                          <br />
                          {item.city}, {item.postalCode}
                          <br />
                          {item.province} {item.city}
                        </p>
                      </div>
                    </div>

                    <div className="orderTracking_deliveryItem">


                      <div className="orderTracking_deliveryContent">
                        <h3 className="orderTracking_deliveryTitle">
                          Estimated Delivery
                        </h3>

                        <p className="orderTracking_deliveryText">
                          September 4, 2026
                        </p>
                      </div>
                    </div>

                    <div className="orderTracking_deliveryItem">


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

                    {myOrders && item.shoppingCart.map((shoe, index) => {
                      return (
                        <section>
                            <div className="orderTracking_product">

                            <div className="orderTracking_productImage orderTracking_adidasImage">
                              <span className="orderTracking_productPlaceholder">
                                <img className="orderStatus_shoeImage" src={shoe.imageUrls[0]} key={index} />
                              </span>
                            </div>

                            <div className="orderTracking_productInfo">
                              <h3 className="orderTracking_productName">
                                {shoe.productName} {shoe.productType}
                              </h3>

                              <p className="orderTracking_productDetails">
                                Color: {shoe.productColor}
                                <span className="orderTracking_separator">•</span>
                                Size: {shoe.productSize}
                              </p>

                              <p className="orderTracking_productPrice">
                                R{shoe.price}
                              </p>
                            </div>

                            <div className="orderTracking_productQuantity">
                              Qty: {shoe.quantity}
                            </div>

                            <div className="orderTracking_productTotal">
                              R{shoe.quantity*shoe.price}
                            </div>

                          </div>


                       


                        </section>
                      )
                    })
                    }


                  </div>

                </div>
              </section>

              {/* Back Button */}
              <button className="orderTracking_backButton" onClick={() => { return navigate(-1) }}>


                Back to Shopping
              </button>

            </main>
          )
        })

        }



      </div>
    </>
  );
};

export default OrderStatus;