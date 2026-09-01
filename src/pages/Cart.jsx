import React, { useState, useEffect } from "react";
import "../styles/Cart.css";
import Navbar from '../components/Navbar';
import Footer2 from '../components/Footer2';
import { useNavigate } from "react-router-dom"



const Cart = () => {

  // USENAVIGATE USED TO NAVIGATE TO THE PRODUCTS PAGE AND THE CHECKOUT PAGE 
  const navigate = useNavigate();

  // STATE USED TO STORE A CART FOR A USER
  const [myCartDisplay, setMyCartDisplay] = useState();

  // Will be used to track how many shoes a customer is choosing to buy
  const [shoeQuantity, setShoeQuantity] = useState({});

  // USESTATE USED TO STORE THE TOTAL PRICE 
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {

    // FUNCTION USED TO COLLECT THE CART FROM THE CARTS COLLECTION 
    const getMyCartsDisplay = async () => {

      try {
        const { accessTokenUserId, accessToken } = JSON.parse(sessionStorage.getItem("KicksNationz"));

        // console.log("access token user id: ", accessTokenUserId)
        // console.log("access token : ", accessToken)

        const response = await fetch(`//localhost:3000/mycart/${accessTokenUserId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            authorization: `Basic ${accessToken}`
          }
        }
        );

        const data = await response.json();

        if (response.status !== 200) {
          alert(data.message);
          return;
        }
        else {

          // CALLING THE FUNCTION USED TO UPDATE THE TOTAL PRICE
          calculateTotalPrice(data.message);

          // STORING THE ARRAY OF SHOE OBJECTS IN THE STATE VARIABLE
          setMyCartDisplay(() => { return data.message });

        };
      }
      catch (error) {
        console.error("Error while trying toget all the cart items: ", error)
      }
    }

    getMyCartsDisplay();

  }, []);

  const increaseShoeQuantity = async (itemIndex) => {

    try {

      const currentCart = myCartDisplay;

      console.log("increaseQuantity is running")

      if (currentCart[itemIndex]["quantity"] === currentCart[itemIndex]["stockQuantity"]) {
        return;
      }
      else {
        currentCart[itemIndex]["quantity"] = (currentCart[itemIndex]["quantity"] + 1);

        // CALLING THE FUNCTION USED TO UPDATE THE TOTAL PRICE
        calculateTotalPrice(currentCart);

        // UPDATING THE STATE VARIABLE TO HOLD THE UPDATED SHOES INFORMATION
        setMyCartDisplay(() => { return [...currentCart] });

        const { accessToken, accessTokenUserId } = JSON.parse(sessionStorage.getItem("KicksNationz"));
        const response = await fetch(`//localhost:3000/editcart/${accessTokenUserId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Basic ${accessToken}`
          },
          body: JSON.stringify({ shoppingCart: currentCart, totalPrice })
        })
      }

    }
    catch (error) {
      console.error("increaseShoeQuantity function: ", error);
    }
  }


  const decreaseShoeQuantity = async (itemIndex) => {

    try {

      const currentCart = myCartDisplay;


      if (currentCart[itemIndex]["quantity"] === 1) {
        return;
      }
      else {
        currentCart[itemIndex]["quantity"] = (currentCart[itemIndex]["quantity"] - 1);

        // CALLING THE FUNCTION USED TO UPDATE THE TOTAL PRICE
        calculateTotalPrice(currentCart);

        // UPDATING THE STATE VARIABLE TO HOLD THE UPDATED SHOES INFORMATION
        setMyCartDisplay(() => { return [...currentCart] });


        const { accessToken, accessTokenUserId } = JSON.parse(sessionStorage.getItem("KicksNationz"));
        const response = await fetch(`//localhost:3000/editcart/${accessTokenUserId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Basic ${accessToken}`
          },
          body: JSON.stringify({ shoppingCart: currentCart, totalPrice })
        })
      }

    }
    catch (error) {
      console.error("decreaseShoeQuantity function: ", error)
    }
  }


  const removeFromCart = async (itemIndex) => {

    try {

      const currentCart = myCartDisplay;

      // REMOVING THE SHOE FROM THE CART BY USING ITS INDEX AS THE PARAMETER
      currentCart.splice(itemIndex, 1);

      // CALLING THE FUNCTION USED TO UPDATE THE TOTAL PRICE
      calculateTotalPrice(currentCart);

      // UPDATING THE STATE VARIABLE TO HOLD THE UPDATED SHOES INFORMATION
      setMyCartDisplay(() => { return [...currentCart] });


      const { accessToken, accessTokenUserId } = JSON.parse(sessionStorage.getItem("KicksNationz"));
      const response = await fetch(`//localhost:3000/editcart/${accessTokenUserId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Basic ${accessToken}`
        },
        body: JSON.stringify({ shoppingCart: currentCart, totalPrice })
      })


    } catch (error) {
      console.error("removeFromCart function: ", error)
    }
  }

  const calculateTotalPrice = (currentCart= 0) => {

    // MAPPING THROUGH THE CART THAT IS GOING TO BE SENT TO THE DATABASE 
    // AND MULTIPLYING THE PRICES WITH THE QUANTITIES
    //  IN ORDER TO MAKE SURE THAT TOTAL NMBER OF ITEMS IS ACCURATE 
    const TotalAmount = currentCart.reduce((total, item) => {
      return (total + (item.price * item.quantity))
    }, 0);

    // LETTING A STATE VARIABLE HOLD THE TOTAL PRICE
    setTotalPrice(() => { return TotalAmount })
  }



  return (
    <>
      <div className="cart_page">
        <Navbar />

        <main className="cart_container">
          <h1 className="cart_heading">Your Cart</h1>


          <p className="cart_subheading">
            Review your items and proceed to checkout.
          </p>

          <div className="cart_content">
            {/* Left Side */}
            <section className="cart_items">

              {myCartDisplay && myCartDisplay.map((item, index) => {
                return (
                  <div className="cart_item" key={index}>
                    <img
                      src={item.imageUrls[0]}
                      alt={item.productName}
                      className="cart_image"
                    />

                    <div className="cart_details">
                      <h3>{item.productName} {item.productType}</h3>
                      <p>Color: {item.productColor}</p>
                      <p>Size: {item.productSize}</p>
                      <h4>R{item.price}</h4>
                    </div>

                    <div className="cart_quantity">

                      <div className="productDetails_counterSection">

                        < button className="productDetails_decreaseBtn" onClick={() => { return decreaseShoeQuantity(parseInt(index)) }} >-</button>

                        <p className="productDetails_counterValue">
                          {item["quantity"]}
                        </p>

                        < button className="productDetails_increaseBtn" onClick={() => { return increaseShoeQuantity(parseInt(index)) }} >+</button>

                      </div>
                    </div>

                    <h4 className="cart_price">R{(item.price * item.quantity)}</h4>

                    <button className="cart_remove" id={index} onClick={removeFromCart} >×</button>
                  </div>
                )
              })}




              {/* Item 1 */}
              {/* <div className="cart_item">
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
            </div> */}

              <button className="cart_continue" onClick={() => { return navigate("/") }} >
                ← Continue Shopping
              </button>
            </section>

            {/* Right Side */}
            <aside className="cart_summary">
              <h2>Order Summary</h2>

              <div className="cart_summary_row">
                <span>Subtotal</span>
                <span>R{totalPrice}</span>
              </div>

              <hr />

              <div className="cart_summary_total">
                <span>Total</span>
                <h2>R{totalPrice}</h2>
              </div>

              <label>Have a promo code?</label>

              <div className="cart_promo">
                <input
                  type="text"
                  placeholder="Enter promo code"
                />
                <button>Apply</button>
              </div>

              <button className="cart_checkout" onClick={ ()=>{ return navigate("/Checkout") } }>
                Proceed to Checkout
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