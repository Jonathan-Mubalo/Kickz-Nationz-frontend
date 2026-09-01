import React, { useState, useEffect, useRef } from "react";
import "../styles/Checkout.css";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Checkout = () => {

  // USED TO NAVIGATE BETWEEN DIFFERENT PAGES
  const navigate = useNavigate();

  // USED TO STORE THE INFORMATION FROM THE CARTS COLLECTION IN THE STATE VARIABLE
  const [myOrderSummary, setMyOrderSummary] = useState();

  // STATE VARIABLE USED TO STORE THE TOTAL PRICE OF THE CART THAT IS BEING PAID FOR
  const [ paymentTotal, setPaymentTotal ] = useState(0);

  // USEREF USED TO TRACK THE SELECTED DELIVERY METHOD
const deliveryMethod = useRef();

// USEREF THAT WILL STORE THE VALUE OF THE NAME 
const fullName = useRef();

  // USEREF SED TO TRACK THE SELECTED DELIVERY METHOD
const emailAddress = useRef();

  // USEREF SED TO TRACK THE SELECTED DELIVERY METHOD
const phoneNumber = useRef();

  // USEREF SED TO TRACK THE SELECTED DELIVERY METHOD
const shippingAddress = useRef();

  // USEREF SED TO TRACK THE SELECTED DELIVERY METHOD
const postalCode = useRef();

  // USEREF SED TO TRACK THE SELECTED DELIVERY METHOD
const city = useRef();

// USEREF USED TO TRACK THE SELECTED PROVINCE
const province = useRef();

// USEREF USED TO TRACK THE PAYMENT METHOD
const paymentMethod = useRef();

  // USEREF SED TO TRACK THE SELECTED DELIVERY METHOD
const cardNumber = useRef();

  // USEREF SED TO TRACK THE SELECTED DELIVERY METHOD
const expireryDate = useRef();

  // USEREF SED TO TRACK THE SELECTED DELIVERY METHOD
const CVV = useRef();

  // USEEFFECT USE TO COLLECT ALL OF THE SHOES FROM THE CARTS COLLECTION
  useEffect(() => {

    const myCheckoutInfo = async () => {

      try {

        const { accessTokenUserId, accessToken } = JSON.parse(sessionStorage.getItem("KicksNationz"));
        const response = await fetch(`//localhost:3000/mycart/${accessTokenUserId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Basic ${accessToken}`
          }
        });

        const data = await response.json();

        console.log("Cart collected from the database", data.message);

        setMyOrderSummary( ()=>{ return data.message } );

        const currentTotal =  data.message.reduce( (total,item)=>{
          return ( total + (item.quantity * item.price) )
        },0 )
        setPaymentTotal( ()=>{
           return ( currentTotal );
        })

      } catch (error) {
        console.error("MyCartDisplay function: ", error);
      }
    }
    
    myCheckoutInfo();

  }, [])

  const submitCheckoutPayment = async () =>{

    try{

      console.log("Function has started")

  const { accessTokenUserId, accessToken } = JSON.parse(sessionStorage.getItem("KicksNationz"));
        const response = await fetch(`//localhost:3000/postcartinorder/${accessTokenUserId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Basic ${accessToken}`
          },
          body:JSON.stringify({
deliveryMethod: deliveryMethod.current.value,
fullName: fullName.current.value,
emailAddress: emailAddress.current.value,
phoneNumber: phoneNumber.current.value,
shippingAddress: shippingAddress.current.value,
postalCode: postalCode.current.value,
city: city.current.value,
province: province.current.value,
// paymentMethod: paymentMethod.current.value,
cardNumber: cardNumber.current.value,
expireryDate: expireryDate.current.value,
  CVV: CVV.current.value
          })
        });

        const data = await response.json();

        console.log("Database info: ", data.message)

      console.log("Function has ended")
        

    }
catch (error){
        console.error("submitCheckoutPayment function: ", error);
}
  }


  return (
    <div className="checkout_page">

      <Navbar />

      <main className="checkout_main">

        <div className="checkout_title_section">

          <h1 className="checkout_title">
            Checkout
          </h1>

          <p className="checkout_subtitle">
            Complete your order
          </p>

        </div>


        <div className="checkout_content">

          <section className="checkout_form">

            {/* Contact Information */}
            <div className="checkout_section">

              <h2 className="checkout_section_title">
                1. Contact Information
              </h2>

              <div className="checkout_two_columns">

                <div className="checkout_field">

                  <label className="checkout_label">
                    Email Address
                  </label>

                  <input
                  ref={emailAddress}
                    type="email"
                    className="checkout_input"
                    placeholder="example@email.com"
                  />

                </div>

                <div className="checkout_field">

                  <label className="checkout_label">
                    Phone Number
                  </label>

                  <input
                  ref={phoneNumber}
                    type="tel"
                    className="checkout_input"
                    placeholder="071 234 5678"
                  />

                </div>

              </div>

            </div>


            {/* Shipping Address */}
            <div className="checkout_section">

              <h2 className="checkout_section_title">
                2. Shipping Address
              </h2>


              {/* Full Name */}
              <div className="checkout_field checkout_full_width">

                <label className="checkout_label">
                  Full Name
                </label>

                <input
                ref={fullName}
                  type="text"
                  className="checkout_input"
                  placeholder="John Doe"
                />

              </div>


              {/* Address */}
              <div className="checkout_field checkout_address_field">

                <label className="checkout_label">
                  Address
                </label>

                <div className="checkout_address_row">

                  <input
                ref={shippingAddress}
                    type="text"
                    className="checkout_input"
                    placeholder="123 Main Street, Green Point"
                  />

                  <div className="checkout_postal_field">

                    <label className="checkout_label">
                      Postal Code
                    </label>

                    <input
                ref={postalCode}
                      type="text"
                      className="checkout_input"
                      placeholder="8001"
                    />

                  </div>

                </div>

              </div>


              {/* City / Province / Postal Code */}
              <div className="checkout_three_columns">

                <div className="checkout_field">

                  <label className="checkout_label">
                    City
                  </label>

                  <input
                ref={city}
                    type="text"
                    className="checkout_input"
                    placeholder="Cape Town"
                  />

                </div>

                <div className="checkout_field">

                  <label className="checkout_label">
                    Province
                  </label>

                  <input
                ref={province}
                    type="text"
                    className="checkout_input"
                    placeholder="Western Cape"
                  />

                </div>


              </div>

            </div>

            <div className="checkout_bottom_sections">

              {/* Delivery */}
              <div className="checkout_delivery">

                <h2 className="checkout_section_title">
                  3. Delivery Method
                </h2>

                <div className="checkout_field">

                  <label className="checkout_label" onChange={ ()=>{ return displayShoppingprice } }>
                    Select Delivery Method
                  </label>

                  <select className="checkout_select" ref={deliveryMethod}>

                    <option value="150">
                      Standard Delivery (2-4 business days)
                    </option>

                    <option value="100">
                      Express Delivery (1-2 business days)
                    </option>

                  </select>

                </div>

              </div>


              {/* Payment */}
              <div className="checkout_payment">

                <h2 className="checkout_section_title">
                  4. Payment Method
                </h2>


                <div className="checkout_payment_options">

                  <label className="checkout_radio_option">

                    <input
                      type="radio"
                      name="payment"
                      defaultChecked
                    />

                    <span>
                      Credit / Debit Card
                    </span>

                  </label>


                  <label className="checkout_radio_option">

                    <input
                      type="radio"
                      name="payment"
                    />

                    <span>
                      PayPal
                    </span>

                  </label>


                </div>


                {/* Card Number */}
                <div className="checkout_field">

                  <label className="checkout_label">
                    Card Number
                  </label>

                  <input
                  ref={cardNumber}
                    type="text"
                    className="checkout_input"
                    placeholder="1234 5678 9012 3456"
                  />

                </div>


                {/* Expiry + CVV */}
                <div className="checkout_card_details">

                  <div className="checkout_field">

                    <label className="checkout_label">
                      Expiry Date
                    </label>

                    <input
                    ref={expireryDate}
                      type="text"
                      className="checkout_input"
                      placeholder="MM / YY"
                    />

                  </div>

                  <div className="checkout_field">

                    <label className="checkout_label">
                      CVV
                    </label>

                    <input
                    ref={CVV}
                      type="text"
                      className="checkout_input"
                      placeholder="123"
                    />

                  </div>

                </div>

              </div>

            </div>

          </section>

          <aside className="checkout_summary">

            <h2 className="checkout_summary_title">
              Order Summary
            </h2>


            {/* Product */}
            { myOrderSummary && myOrderSummary.map( (item,index)=>{
                return(
                      <div className="checkout_product" key={index} >

              <h3 className="checkout_product_name">
              {item.productName}
              </h3>

              <p className="checkout_product_info">
                Color: {item.productColor}
              </p>

              <p className="checkout_product_info">
                Size: {item.productSize}
              </p>

              <div className="checkout_product_quantity">

                <span>
                  Quantity:  {item.quantity}
                </span>

                <strong>
                  R{(item.quantity *item.price)}
                </strong>

              </div>

            </div>
                )
              })
            }
            {/* <div className="checkout_product">

              <h3 className="checkout_product_name">
                Nike Air Force 1
              </h3>

              <p className="checkout_product_info">
                Color: White
              </p>

              <p className="checkout_product_info">
                Size: 8
              </p>

              <div className="checkout_product_quantity">

                <span>
                  Quantity: 1
                </span>

                <strong>
                  R1300
                </strong>

              </div>

            </div> */}


            {/* Price Summary */}
            <div className="checkout_price_summary">

              <div className="checkout_price_row">

                <span>
                  Subtotal
                </span>

                <strong>
                  R{paymentTotal}
                </strong>

              </div>


              <div className="checkout_price_row">

                <span>
                  Shipping
                </span>

                <strong>
                  R150
                </strong>

              </div>

            </div>


            {/* Total */}
            <div className="checkout_total">

              <span>
                Total
              </span>

              <strong>
                R{(paymentTotal + 150)}
              </strong>

            </div>


            {/* Promo Code */}
            <div className="checkout_promo">

              <label className="checkout_label">
                Have a promo code?
              </label>

              <div className="checkout_promo_row">

                <input
                  type="text"
                  className="checkout_promo_input"
                  placeholder="Enter promo code"
                />

                <button className="checkout_apply_button">
                  Apply
                </button>

              </div>

            </div>


            {/* Place Order */}
            <button className="checkout_place_order" onClick={ ()=>{ return submitCheckoutPayment() } } >
              <span className="checkout_lock">
              </span>

              Place Order
            </button>

            <button className="checkout_place_order" onClick={() => { return navigate("/Cart") }}>
              Back to cart
            </button>


            {/* Secure Checkout */}
            <div className="checkout_secure">

             

              <div className="checkout_secure_content">

                <h3 className="checkout_secure_title">
                  Secure Checkout
                </h3>

                <p className="checkout_secure_text">
                  Your payment information is encrypted
                  <br />
                  and safe with us.
                </p>

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
};

export default Checkout;