import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { ProductContext } from '../context/ProductProvider';
import Navbar from "../components/Navbar";
import "../styles/ProductDetails.css"

const ProductDetails = () => {

  // WilL be used to go back to the previous page
  const navigate = useNavigate();

  // Will b used to filter the shoe that needs to be displayed from the context's state variable 
  const [currentShoe, setCurrentShoe] = useState();

  // Will be used to track how many shoes a customer is choosing to buy
  const [shoeQuantity, setShoeQuantity] = useState(1);

  // Will set the image display in the min image section
  const [selectedImage, setSelectedImage] = useState();

  // Will store the shoe color that the user has selected
  const [shoeColor, setShoeColor] = useState();

  // Will store the shoe color that the user has selected
  const [shoeSize, setShoeSize] = useState();

  // WILL BE USED TO FILTER THE RIGHT SHOE AND DISPLAY ITS DETAILS
  const { allProducts, filteredId } = useContext(ProductContext);

  console.log("filteredId: ", filteredId)
  useEffect(() => {

    if (filteredId) {
      const specificShoe = allProducts.filter((item) => { return item["_id"] === filteredId });
      setCurrentShoe(() => { return specificShoe });
      console.log("specificShoe: ", specificShoe)

      sessionStorage.setItem("selectedStoredShoe", JSON.stringify(specificShoe));

    }

    // Display the element stored inside of the sessionStorage when the component is reloaded  hwich clears the state variable
    else {
      setCurrentShoe(() => { return JSON.parse(sessionStorage.getItem("selectedStoredShoe")) });
    }
  }
    , []);


  // FUNCTION USED TO DISPLAY THE IMAGES THE USER SELECTS TO SEE

  const handleImageDisplay = (event) => {
    let imgUrl = event.target.src;
    setSelectedImage(() => { return imgUrl })
  }


  // ENDPOINT FUNCTION USED TO ADD A SHOE TO A CART
  console.log("Currnt shoe: ", currentShoe)
  
  const addToCart = async () => {

    try {

      // Used to make sure that a user selects their specific shoe size because every other feild is prefilled
      if (!shoeSize) {
        return alert("Please select the shoe size that you would like to purchase.")
      }

      const { accessTokenUserId, accessToken } = JSON.parse(sessionStorage.getItem("KicksNationz"));
      const response = await fetch(`//localhost:3000/selectedproduct/${accessTokenUserId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Basic ${accessToken}`
        },
        body: JSON.stringify({
          productId: currentShoe[0]["_id"],
          quantity: shoeQuantity,
          productName: currentShoe[0].productName,
          productType: currentShoe[0].shoeType,
          productColor: shoeColor,
          productSize: shoeSize,
          currency: currentShoe[0].currency,
          price: currentShoe[0].price,
          imageUrls: currentShoe[0].imageUrls,
          // encodedEmail: accessTokenUserId, 
          // stockQuantity: currentShoe[0].stockQuantity, We will just use the product id to get the current stock quantity
        })
      });

    }
    catch (error) {
      console.error("There was an error trying to post yourshoe inside your shopping cart: ", error)
    }
  }

  // CRUD FUNCTION USED TO ADD A SHOE PRODUCT TO THE WISHLIST

  const addToWishlist = async() =>{

try{

      const { accessTokenUserId, accessToken } = JSON.parse(sessionStorage.getItem("KicksNationz"));
  const response = await fetch('//localhost:3000/wishlist',{
    method: "POST",
    headers: {"Content-Type": "application/json",
      authorization: `Basic ${accessToken}`
    }, body: JSON.stringify({
          productId: currentShoe[0]["_id"],
          quantity: shoeQuantity,
          encodedEmail: accessTokenUserId,
          productName: currentShoe[0].productName,
          productType: currentShoe[0].shoeType,
          productColor: currentShoe[0].productColor,
          productSize: shoeSize,
          currency: currentShoe[0].currency,
          price: currentShoe[0].price,
          imageUrls: currentShoe[0].imageUrls,
          stockQuantity: currentShoe[0].stockQuantity
        })
      });

  const data = await response.json();

  if( response.status !== 200 ){
    alert( data.message );
  }
  else{
    // Logging the id of the updated/ created wishlist
console.log(data);
  }

}
catch (error){
  console.error("Failed to add a shoe to the wishlist: ",error);
}
  }

  return (
    <>

      {currentShoe && currentShoe.map((item) => {
        return (
          <main className="productDetails_main" key="selectedShoes" >
            <Navbar />
            <p className="productDetails_goBackTag" onClick={() => { return navigate(-1) }}>Back to products</p>
            <div className="productDetails_mainContent">
              <section className="productDetails_imageSelection">
                {
                  item.imageUrls.map((imgItem, index) => {
                    return (<div className="productDetails_imageSelectDiv" key={`id${index}`}>
                      <img className="productDetailImg" src={imgItem} onClick={handleImageDisplay} />
                    </div>)
                  })}
              </section>

              <section className="productDetails_imageDisplay">
                <img src={(selectedImage) ? selectedImage : item.imageUrls[0]} alt="" className="productDetails_selectedDisplay" />
              </section>

              <section className="productDetails_shoeInfo">

                <h2 className="productDetails_name" >{item.productName} {item.shoeType}</h2>
                <h3 className="productDetails_price">R{item.price}</h3>

                <p className="productDetails_shoeDetail">The legend lives on in the Nike Air Force 1 '07,</p>

                <p className="productDetails_shoeSelectedColor">Color: {(shoeColor) ? shoeColor : setShoeColor(() => { return item.productColor[0] })}</p>
                <section className="productDetails_shoeColorSection">
                  {item.productColor.map((itemColor) => {
                    return (
                      <div className="productDetails_shoeColor" key={itemColor} id={itemColor} style={{
                        backgroundColor: itemColor.toLowerCase()

                      }} onClick={(event) => { return setShoeColor(() => { return event.target.id }) }} ></div>
                    )
                  }
                  )}
                </section>


                <p className="productDetails_shoeSizeTitle">Size: {(shoeSize) ? shoeSize : ""}</p>
                <section className="productDetails_shoeSizeSection">
                  {item.productSize.map((itemSize) => {
                    return (
                      <div className="productDetails_shoeSize" key={itemSize} id={itemSize} onClick={(event) => {
                        return setShoeSize(() => { return event.target.id })
                      }}>{itemSize}</div>
                    )
                  })}
                </section>

                <section className="productDetails_shoeQuantitySection">
                  <p className="productDetails_shoeQuantityTitle">Quantity:</p>
                  <div className="productDetails_counterSection">

                    {/* BLOCK OF CODE USED TO SET THE COUNTER TO TRACKHOW MANY SHOES SOMEONE WANTS TO ORDER */}

                    {/* MAKING SURE THAT A PERSON ORDERS ATLEAST ONE SHOE */}
                    < button className="productDetails_decreaseBtn" onClick={() => { return setShoeQuantity(() => { return ((shoeQuantity === 1) ? 1 : shoeQuantity - 1) }) }} >-</button>

                    <p className="productDetails_counterValue">{shoeQuantity}</p>
                    {/* MAKING SURE THA THE AMOUNT OF SHOE THAT THE PERSON WANTS TO ORDER IS STILL IN STOCK */}
                    < button className="productDetails_increaseBtn" onClick={() => { return setShoeQuantity(() => { return ((shoeQuantity === item.stockQuantity) ? item.stockQuantity : shoeQuantity + 1) }) }} >+</button>

                  </div>
                </section>

                <section className="productDetails_addToBtns">
                  <button className="productDetails_AddToCartBtn" onClick={addToCart}>Add to Cart</button>
                  <button className="productDetails_AddToWishlistBtn" onClick={ addToWishlist }>Add to Wishlist</button>
                </section>

              </section>
            </div>
            <footer className='reviewFooter'>
              <h3 className="productDetails_h3">Customer reviews</h3>
              <section className="productDetails_starsSection">

                <svg className="productDetails_stars" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path fill="currentColor" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z" />
                </svg>

                <svg className="productDetails_stars" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path fill="currentColor" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z" />
                </svg>

                <svg className="productDetails_stars" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path fill="currentColor" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z" />
                </svg>

                <svg className="productDetails_stars" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path fill="currentColor" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z" />
                </svg>

                <svg className="productDetails_stars" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path d="M0 0h24v24H0z" fill="none" />
                  <path fill="currentColor" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z" />
                </svg>

                <p className="productDetails_reviewsPtag">(128 reviews)</p>
              </section>
            </footer>
          </main>
        )
      }
      )
      }





      {/*       
        <main className="productDetails_main">
            <Navbar />
      <p className="productDetails_goBackTag" onClick={ () => { return navigate("-1")}}>Back to products</p>
        <div className="productDetails_mainContent">
          <section className="productDetails_imageSelection">
            <div className="productDetails_imageSelectDiv">The page </div>
<div className="productDetails_imageSelectDiv">The image</div>
<div className="productDetails_imageSelectDiv">The image</div>
<div className="productDetails_imageSelectDiv">The image</div>
<div className="productDetails_imageSelectDiv">The image</div>
          </section>
          <section className="productDetails_imageDisplay">
            <div>Main image</div>
            <img src="" alt="" />
          </section>

          <section className="productDetails_shoeInfo">

            <h2 className="productDetails_name" >Nike Air Force 1</h2>
            <h3 className="productDetails_price">R1300</h3>

            <p className="productDetails_shoeDetail">The legend lives on in the Nike Air Force 1 '07,</p>

            <p className="productDetails_shoeSelectedColor">Color: White</p>
            <section className="productDetails_shoeColorSection">
              <div className="productDetails_shoeColor"></div>
              <div className="productDetails_shoeColor"></div>
              <div className="productDetails_shoeColor"></div>
              <div className="productDetails_shoeColor"></div>
            </section>

            <p className="productDetails_shoeSizeTitle">Size</p>
            <section className="productDetails_shoeSizeSection">
              <div className="productDetails_shoeSize">6</div>
              <div className="productDetails_shoeSize">7</div>
              <div className="productDetails_shoeSize">8</div>
              <div className="productDetails_shoeSize">9</div>
            </section>

            <section className="productDetails_shoeQuantitySection">
              <p className="productDetails_shoeQuantityTitle">Quantity:</p>
                <div className="productDetails_counterSection">
                    < button className="productDetails_decreaseBtn" onClick={()=>{ return setCounterValue( ()=>{ return ((counterValue === 0) ? 0: counterValue - 1) })}} >-</button>
                    <input className="productDetails_counterInput" value={counterValue} readOnly />
                    < button className="productDetails_increaseBtn" onClick={()=>{ return setCounterValue( ()=>{ return (counterValue + 1) })}} >+</button>
              </div>
            </section>

            <section className="productDetails_addToBtns">
              <button className="productDetails_AddToCartBtn">Add to Cart</button>
              <button className="productDetails_AddToWishlistBtn">Add to Wishlist</button>
            </section>

          </section>
        </div>
        <footer className='reviewFooter'>
          <h3 className="productDetails_h3">Customer reviews</h3>
          <section className="productDetails_starsSection">

            <svg className="productDetails_stars" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<path fill="currentColor" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z" />
</svg>

<svg className="productDetails_stars" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<path fill="currentColor" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z" />
</svg>

<svg className="productDetails_stars" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<path fill="currentColor" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z" />
</svg>

<svg className="productDetails_stars" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<path fill="currentColor" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z" />
</svg>

<svg className="productDetails_stars" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<path fill="currentColor" d="m5.825 21l1.625-7.025L2 9.25l7.2-.625L12 2l2.8 6.625l7.2.625l-5.45 4.725L18.175 21L12 17.275z" />
</svg>

<p className="productDetails_reviewsPtag">(128 reviews)</p>
          </section>
           </footer >
      </main >
           */}

    </>
  );
}

export default ProductDetails;