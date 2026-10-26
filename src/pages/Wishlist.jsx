import React, { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Footer2 from "../components/Footer2";
import "../styles/Wishlist.css";

const Wishlist = () => {
  // USESTATE THAT WILL STORE A USERS WISHLIST ITEMS THAT ARE COLLECTED FROM THE DATABASE
  const [myWishlistDisplay, setMyWishlistDisplay] = useState({});

  // VARIABLE USED TO LET A USER KNOW HOW MANY ITEMS ARE STOREDIN THE CART
  const [noOfShoes, setNoOfShoes] = useState(0);

  // Will set the image display in the min image section
  const [selectedImage, setSelectedImage] = useState({});

  // Will store the shoe color that the user has selected
  const [shoeColor, setShoeColor] = useState({});

  // USEEFFECT THAT WILL BE USED TO GOLLECT THE USERS WISHLIST FROM THE WISHLIST COLLECTION
  useEffect(() => {
    const getMyWishlist = async () => {
      try {
        const { accessToken, accessTokenUserId } = JSON.parse(
          sessionStorage.getItem("KicksNationz"),
        );
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/mywishlist/${accessTokenUserId}`,
          {
            method: "GET",
            headers: { authorization: `Basic ${accessToken}` },
          },
        );

        const data = await response.json();

        if (response.status !== 200) {
          console.log("Error section: ", data.message);

          // return setMyWishlistDisplay(() => { return data.message });

          return;
        } else {
          // Storing the users wishlist in the state variable if their wishlist exsists
          setMyWishlistDisplay(() => {
            return data.message;
          });

          // Setting the length of shoes found inside the users cart

          // console.log("Wishlist length: ", data.message.wishlistCart.length)
          setNoOfShoes(() => {
            return data.message.wishlistCart
              ? data.message.wishlistCart.length
              : 0;
          });
        }
      } catch (error) {
        console.error(
          "There was an error trying to get the whole wishlist : ",
          error,
        );
      }
    };

    getMyWishlist();
  }, []);

  // ENDPOINT FUNCTION USED TO REMOVE A SHOE FROM THE WISHLIST WHEN IT IS ADDED TO THE CART OR JUST REMOVED FROM THE WISHLIST

  const removeFromWishlist = async (shoeIndex) => {
    try {
      const { accessTokenUserId, accessToken } = JSON.parse(
        sessionStorage.getItem("KicksNationz"),
      );
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/removeFromWishlist/${accessTokenUserId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Basic ${accessToken}`,
          },
          body: JSON.stringify({
            position: shoeIndex,
          }),
        },
      );

      const data = await response.json();

      if (response.status === 200) {
        // The whole wishlist objest is currently stored in the state variable
        const wishlistObj = myWishlistDisplay;

        // console.log("Actual arr to work on: ",wishlistArr)
        // console.log("Id to be used for splicing: ",parseInt(event.target.id))

        const update = wishlistObj.wishlistCart.splice(
          parseInt(shoeIndex),
          1,
        );

        // Storing the users wishlist in the statevariable if their wishlist exsists
        setMyWishlistDisplay(() => {
          return wishlistObj;
        });

        console.log(data.message);
        // console.log("Wishlist length: ", wishlistObj.wishlistCart.length)

        // Setting the length of shoes found inside the users cart

        setNoOfShoes(() => {
          return wishlistObj.wishlistCart.length;
        });

        return;
      } else {
        return alert(data.message);
      }
    } catch (error) {
      console.error("Error trying to remove a shoe from the wishlist: ", error);
    }
  };

  // ENDPOINT FUNCTION USED TO ADD A SHOE TO A CART

  const addToCart = async ( shoeIndex, selectedShoeColor ) => {
    try {

      // SELECTING THE SHOE THAT MUST BE REMOVED FROM THE WISHLIST AND ADDED TO THE CART
     const selectedShoeObject = myWishlistDisplay.wishlistCart[shoeIndex];

      // STORING THE OBJECT TO MUTATE(WORK WITH) INSIDE A VARIABLE
      const wholeWishlistObject = myWishlistDisplay;

      // REMOVING THE SHOE FROM THE MAIN WISHLIST DISPLAY STATE VARIABLE
      const newWishlistDisplay = wholeWishlistObject.wishlistCart.splice( shoeIndex,1 );
      console.log("The new wishlist display: ",newWishlistDisplay)
      
      // UPDATING THE DISPLAY OF THE SHOES DISPLAYED ON THE CURRENT SCREEN
      setMyWishlistDisplay(() => {
        return { ...wholeWishlistObject };
      });
      setNoOfShoes(() => {
        return wholeWishlistObject.wishlistCart
          ? wholeWishlistObject.wishlistCart.length
          : 0;
      });

      // console.log( "whole wishlist display after the splite method: ", wholeWishlistObject);
      // console.log( "The actual current my wishlist array display after the splite method: ",newWishlistDisplay);

      const { accessTokenUserId, accessToken } = JSON.parse(
        sessionStorage.getItem("KicksNationz"),
      );

    //  THE SHOE COLOR THAT THE USER CHOSE FOR THE SHOE 
console.log("The actual color",selectedShoeColor)

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/editwishlist/${accessTokenUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            authorization: `Basic ${accessToken}`,
          },
          body: JSON.stringify({
            wishlistCart: wholeWishlistObject.wishlistCart,
            shoeObject: {
              productId: selectedShoeObject.productId,
              quantity: selectedShoeObject.quantity,
              productName: selectedShoeObject.productName,
              productType: selectedShoeObject.productType,
              productColor: selectedShoeColor,
              productSize: selectedShoeObject.productSize,
              currency: selectedShoeObject.currency,
              price: selectedShoeObject.price,
              imageUrls: selectedShoeObject.imageUrls,
              //  We will just use the product id to get the current stock quantity
              stockQuantity: selectedShoeObject.stockQuantity,
            },
          }),
        },
      );

      const data = await response.json();

      if (response.status !== 200) {
        return alert(data.message);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.error(
        "There was an error trying to post yourshoe inside your shopping cart: ",
        error,
      );
    }
  };

  // ENDPOINT USED TO MOVE ALL OF THE CART ITEMS TO THE DATABASE AT ONCE
  const moveAllToCart = async () => {

    console.log("Shoe color object",shoeColor);

    // UPDATING THE SHOE'S SELECTED SHOE COLOR BEFORE PUSHING IT INTO THE CART
        const wishlistColorUpdate = myWishlistDisplay.wishlistCart.forEach( (item, index)=>{
          if ( shoeColor[`${item.productName}${index}`] ){
            item.productColor = shoeColor[`${item.productName}${index}`]
          } else {
             item.productColor = item.productColor[0];
          }
        })


    try {
      const { accessTokenUserId, accessToken } = JSON.parse(
        sessionStorage.getItem("KicksNationz"),
      );

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/moveAllToCart/${accessTokenUserId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `Basic ${accessToken}`,
          },
          body: JSON.stringify({
            wishlistArray: myWishlistDisplay.wishlistCart,
          }),
        },
      );

      const { message } = await response.json();

      if (response.status === 200) {
        alert(message);
        setMyWishlistDisplay((prev) => {
          return { ...prev, wishlistCart: [] };
        });
    setNoOfShoes(0)
      } else {
        alert("Unable to move all items to cart successfully");
      }
    } catch (error) {
      console.error("Error trying to move all to cart", error);
    }
  };

  return (
    <>
      <Navbar />
      <main className="wishlist_main">
        <section className="wishlist_header">
          <div>
            <h1>My Wishlist</h1>
            <p>
              {" "}
              {parseInt(noOfShoes) === 1
                ? `${noOfShoes} item saved for later`
                : `${noOfShoes} items saved for later`}
            </p>
          </div>

          <button className="wishlist_moveAllBtn" onClick={moveAllToCart}>
            Move All to Cart
          </button>
        </section>

        {/* MAKING SURE THAT THE WISHLIST IS ONLY DISPLAYED WHEN THE THE ARE SHOES IN THE WISHLIST CART MEANING THAT THE WISHLIST CARTS'S LENGTH IS NOT EQUAL TO ZERO */}
        <section className="wishlist_shoeDisplayContainer">
          {noOfShoes !== 0 &&
            myWishlistDisplay.wishlistCart.map((item, index) => {
              return (
                <section className="wishlist_item" key={index}>
                  <div className="wishlist_productImages" id={index}>
                    <div className="wishlist_mainImage">
                      {/* DISPLAYS THE SHOES IMAGE BASED ON WHAT THE USER SELECTS AND THE FIRST ONE BY DEFAULT */}
                      <img
                        src={
                          selectedImage[
                            `${item.productName}${index}`
                          ] || item.imageUrls[0]
                        }
                        alt={item.productName}
                      />
                    </div>

                    <div className="wishlist_imgSelectionContainer">
                      { item.imageUrls.map((url) => {
                        return (
                          <section
                            className="wishlist_imgSelection"
                            key={`img${url}`}
                          >
                            <img
                              src={url}
                              alt={item.productName}
                                // UPDATING THE SHOE COLOR BY TARGETTING THE SHOE USING ITS PRODUCT NAME AND SIZE
                              onClick={() => {
                                const imageName = `${item.productName}${index}`;
                                return setSelectedImage((prev) => {
                                  return { ...prev, [imageName]: url };
                                });
                              }}
                            />
                          </section>
                        );
                      })}
                    </div>
                  </div>

                  <div className="wishlist_productInformation">
                    <h2>
                      {item.productName} {item.productType}
                    </h2>

                    <h3>R{item.price}</h3>
                    <p className="wishlist_addedDate">
                      Added on{" "}
                      {noOfShoes != 0 && item.addedOn
                        ? item.addedOn.split("").slice(0, 10).join("")
                        : ""}
                    </p>
                    <p className="wishlist_productDescription">
                      The legend lives on in the Nike Air Force 1 '07
                    </p>

                    <div className="wishlist_productOption">
                      <p className="wishlist_selectedShoeColor">
                        Color:{" "}
                      {/* DISPLAYS THE SHOES IMAGE BASED ON WHAT THE USER SELECTS AND THE FIRST ONE BY DEFAULT */}
                        {shoeColor[`${item.productName}${index}`] || item.productColor[0] }
                      </p>
                      <section className="wishlist_shoeColorSection">
                        {item.productColor &&
                          item.productColor.map((itemColor) => {
                            return (
                              <div
                                className="wishlist_shoeColor"
                                key={itemColor}
                                id={itemColor}
                                style={{
                                  backgroundColor: itemColor.toLowerCase(),
                                }}
                                // UPDATING THE SHOE COLOR BY TARGETTING THE SHOE USING ITS PRODUCT NAME AND SIZE
                                onClick={(event) => {
                                const colorName = `${item.productName}${index}`;
                                return setShoeColor((prev) => {
                                  return { ...prev, [colorName]: event.target.id };
                                });
                                }}
                              ></div>
                            );
                          })}
                      </section>
                    </div>

                    <div className="wishlist_productSize">
                      <span>Size: {item.productSize}</span>
                    </div>
                    <section className="wishlist_btnContainer">
                      <button
                        className="wishlist_addToCartBtn"
                        onClick={ ()=>{ return addToCart( index,  (shoeColor[`${item.productName}${index}`] || item.productColor[0]) ) } }
                      >
                        Add to Cart
                      </button>

                      <button
                        className="wishlist_removeBtn"
                        onClick={()=>{ return removeFromWishlist(index) } }
                      >
                        Remove
                      </button>
                    </section>
                  </div>
                </section>
              );
            })}
        </section>
        <Footer2 />
      </main>
    </>
  );
};

export default Wishlist;
