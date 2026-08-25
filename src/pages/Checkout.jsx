import React from "react";
import "../styles/Checkout.css";

const Checkout = () => {
  return (
    <div className="checkout_page">

      {/* =====================================
          HEADER / NAVIGATION
      ====================================== */}
      <header className="checkout_header">

        <div className="checkout_logo">
          Kicks Nationz
        </div>

        <nav className="checkout_navigation">

          <a href="/products" className="checkout_nav_link">
            Products
          </a>

          <a href="/wishlist" className="checkout_nav_link">
            Wishlist
          </a>

          <a href="/cart" className="checkout_nav_link">
            Cart
            <span className="checkout_cart_badge">2</span>
          </a>

          <a
            href="/checkout"
            className="checkout_nav_link checkout_nav_active"
          >
            Checkout
          </a>

          <a href="/order-status" className="checkout_nav_link">
            Order Status
          </a>

          <a href="/contact" className="checkout_nav_link">
            Contact Us
          </a>

        </nav>

      </header>


      {/* =====================================
          PAGE CONTENT
      ====================================== */}
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

          {/* =================================
              LEFT SIDE - CHECKOUT FORM
          ================================== */}
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
                    type="text"
                    className="checkout_input"
                    placeholder="123 Main Street, Green Point"
                  />

                  <div className="checkout_postal_field">

                    <label className="checkout_label">
                      Postal Code
                    </label>

                    <input
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
                    type="text"
                    className="checkout_input"
                    placeholder="Western Cape"
                  />

                </div>

                <div className="checkout_field">

                  <label className="checkout_label">
                    Postal Code
                  </label>

                  <input
                    type="text"
                    className="checkout_input"
                    placeholder="8001"
                  />

                </div>

              </div>


              {/* Country */}
              <div className="checkout_country_field">

                <label className="checkout_label">
                  Country
                </label>

                <select className="checkout_select">
                  <option>South Africa</option>
                  <option>Namibia</option>
                  <option>Botswana</option>
                  <option>Zimbabwe</option>
                </select>

              </div>

            </div>


            {/* =================================
                DELIVERY + PAYMENT
            ================================== */}
            <div className="checkout_bottom_sections">

              {/* Delivery */}
              <div className="checkout_delivery">

                <h2 className="checkout_section_title">
                  3. Delivery Method
                </h2>

                <div className="checkout_field">

                  <label className="checkout_label">
                    Select Delivery Method
                  </label>

                  <select className="checkout_select">

                    <option>
                      Standard Delivery (2-4 business days)
                    </option>

                    <option>
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


                  <label className="checkout_radio_option">

                    <input
                      type="radio"
                      name="payment"
                    />

                    <span>
                      Apple Pay
                    </span>

                  </label>

                </div>


                {/* Card Number */}
                <div className="checkout_field">

                  <label className="checkout_label">
                    Card Number
                  </label>

                  <input
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
                      type="text"
                      className="checkout_input"
                      placeholder="123"
                    />

                  </div>

                </div>

              </div>

            </div>

          </section>


          {/* =================================
              RIGHT SIDE - ORDER SUMMARY
          ================================== */}
          <aside className="checkout_summary">

            <h2 className="checkout_summary_title">
              Order Summary
            </h2>


            {/* Product */}
            <div className="checkout_product">

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

            </div>


            {/* Price Summary */}
            <div className="checkout_price_summary">

              <div className="checkout_price_row">

                <span>
                  Subtotal
                </span>

                <strong>
                  R1300
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
                R1450
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
            <button className="checkout_place_order">
              <span className="checkout_lock">
                ♙
              </span>

              Place Order
            </button>


            {/* Secure Checkout */}
            <div className="checkout_secure">

              <div className="checkout_secure_icon">
                ♢
              </div>

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