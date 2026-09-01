import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const SwiperTest = () => {
  return (





  // FUNCTION USED TO DISPLAY THE RIGHT TOTAL PRICE

   const calculateTotalPrice = async (cartObj,cartQuantity) => {

    try {

console.log("Total price function started");

      setTotalPrice(() => {
        return (cartObj.shoppingCart.reduce((Total, item) => {
          return ( Total + (item.price * cartQuantity[item.productType]) )
        },0))
      })

      console.log("Total price has been updated");

      //Updating the cart object quantities 

//       const updatedCartDisplay = myCartDisplay;
// console.log("The object to work with before update: ",cartObj);
// for( let i=0; i<cartObj.shoppingCart.length; i++ ){

//   cartObj.shoppingCart[i]["quantity"] = cartQuantity[cartObj.shoppingCart[i]["productType"]];

// }

// console.log("The object to work with after update: ",cartObj);

// // GETTING ACCESS TOKENS FOR THE CRUD FUNCTION

// const { accessToken, accessTokenUserId } = JSON.parse(sessionStorage.getItem("KicksNationz"));

// const response = await fetch(`//localhost:3000/editCart/${accessTokenUserId}`,{
//   method: "PUT",
//   headers: {
//     "Content-Type":"application/json",
//     authorization: `Basic ${accessToken}`
//   },
//   body: JSON.stringify({ cartObj })
// });

// const data = await response.json();

// if(response.status !== 200 ){
//   alert( data.message );
// }
// else{
//   setMyCartDisplay( ()=>{ return { ...cartObj } });
//   console.log("Database editted: ",cartObj);
// }

  }
    catch (error) {
      console.error("Error in the frontend when updating Total Price", error);
    }
  }


  //FUNCTION USED TO REMOVE A SHOE FROM THE CART; UPDATE THE DISPLAY AND UPDATE THE DATABASE DOCUMENT 

  const removeFromCart = async (event) => {

    try {

      // GETTING THE INDEX OF THE SHOE THAT MUST BE REMOVED FROM THE CART
      console.log("Function has started")
      const pos = parseInt(event.target.id);
      const currentCartDisplay = myCartDisplay;
      const removedShoe = currentCartDisplay.shoppingCart.splice(pos, 1);
      console.log("Removed shoe from the cart: ", removedShoe)
      setMyCartDisplay(() => { return { ...currentCartDisplay } });

      // GETTING THE USER ID NEEDED TO ACCESS THE CART
      const { accessToken, accessTokenUserId } = JSON.parse(sessionStorage.getItem("KicksNationz"));
      const response = await fetch(`//localhost:3000/editcart/${accessTokenUserId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          authorization: `Basic ${accessToken}`
        },
        body: JSON.stringify({ ...currentCartDisplay })
      });

      const data = await response.json();

      if (response.status !== 200) {
        return alert("Your update has not been successfully saved");
      }
      else {
        console.log("Update successfully occured");
        calculateTotalPrice( currentCartDisplay,);
        console.log(data.message);
      }

    } catch (error) {
      return console.error("Error in the frontend trying to delete a product: ", error);
    }
  };





 (
  <></>
  );
};

export default SwiperTest;