import React from "react";
import "../styles/Cart.css";
import Navbar from '../components/Navbar';
import Footer2 from '../components/Footer2';



const Cart = () => {
  return (
    <>
    <div className="cart_page">
   <Navbar />

      {/* Main */}
      <main className="cart_container">
        <h1 className="cart_heading">Your Cart</h1>

        <div className="cart_line"></div>

        <p className="cart_subheading">
          Review your items and proceed to checkout.
        </p>

        <div className="cart_content">
          {/* Left Side */}
          <section className="cart_items">
            {/* Item 1 */}
            <div className="cart_item">
              <img
                src=""
                alt="Nike Air Force 1"
                className="cart_image"
              />

              <div className="cart_details">
                <h3>Nike Air Force 1</h3>
                <p>Color: White</p>
                <p>Size: 8</p>
                <h4>R1300</h4>
              </div>

              <div className="cart_quantity">
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>

              <h4 className="cart_price">R1300</h4>

              <button className="cart_remove">×</button>
            </div>

            {/* Item 2 */}
            <div className="cart_item">
              <img
                src=""
                alt="Adidas Forum Low"
                className="cart_image"
              />

              <div className="cart_details">
                <h3>Adidas Forum Low</h3>
                <p>Color: White / Black</p>
                <p>Size: 9</p>
                <h4>R1500</h4>
              </div>

              <div className="cart_quantity">
                <button>-</button>
                <span>1</span>
                <button>+</button>
              </div>

              <h4 className="cart_price">R1500</h4>

              <button className="cart_remove">×</button>
            </div>

            <button className="cart_continue">
              ← Continue Shopping
            </button>
          </section>

          {/* Right Side */}
          <aside className="cart_summary">
            <h2>Order Summary</h2>

            <div className="cart_summary_row">
              <span>Subtotal</span>
              <span>R2800</span>
            </div>

            <hr />

            <div className="cart_summary_total">
              <span>Total</span>
              <h2>R2800</h2>
            </div>

            <label>Have a promo code?</label>

            <div className="cart_promo">
              <input
                type="text"
                placeholder="Enter promo code"
              />
              <button>Apply</button>
            </div>

            <button className="cart_checkout">
              🔒 Proceed to Checkout
            </button>

            <div className="cart_secure">
              <span>🛡</span>

              <div>
                <h4>Secure Checkout</h4>
                <p>
                  Your payment information is encrypted
                  and safe with us.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
   <Footer2 />
   </>
  );
};

export default Cart;