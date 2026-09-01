import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import Footer2 from '../components/Footer2';
import '../styles/Wishlist.css'

const Wishlist = () => {

    // USESTATE THAT WILL STORE A USERS WISHLIST ITEMS THAT ARE COLLECTED FROM THE DATABASE
    const [myWishlistDisplay, setMyWishlistDisplay] = useState()

    // VARIABLE USED TO LET A USER KNOW HOW MANY ITEMS ARE STOREDIN THE CART 
    const [noOfShoes, setNoOfShoes] = useState(0);

    // Will set the image display in the min image section
    const [selectedImage, setSelectedImage] = useState();

    // Will store the shoe color that the user has selected
    const [shoeColor, setShoeColor] = useState();

    // USEEFFECT THAT WILL BE USED TO GOLLECT THE USERS WISHLIST FROM THE WISHLIST COLLECTION 
    useEffect(() => {
        const getMyWishlist = async () => {

            try {

                const { accessToken, accessTokenUserId } = JSON.parse(sessionStorage.getItem("KicksNationz"))
                const response = await fetch(`//localhost:3000/mywishlist/${accessTokenUserId}`, {
                    method: "GET",
                    headers: { authorization: `Basic ${accessToken}` }
                });

                const data = await response.json();

                if (response.status !== 200) {
                    console.log("Error section: ", data.message);
                    return setMyWishlistDisplay(() => { return data.message });
                }
                else {

                    // Storing the users wishlist in the state variable if their wishlist exsists
                    setMyWishlistDisplay(() => { return data.message });

                    // Setting the length of shoes found inside the users cart

                    // console.log("Wishlist length: ", data.message.wishlistCart.length)
                    setNoOfShoes(() => { return (data.message.wishlistCart) ?data.message.wishlistCart.length : 0 });
                }
            }
            catch (error) {
                console.error("There was an error trying to get the whole wishlist : ", error)
            }
        }

        getMyWishlist();

    }, [])


    // FUNCTION USED TO DISPLAY THE IMAGES THE USER SELECTS TO SEE

    const handleImageDisplay = (event) => {
        let imgUrl = event.target.src;
        setSelectedImage(() => { return imgUrl })
    }


    // ENDPOINT FUNCTION USED TO REMOVE A SHOE FROM THE WISHLIST WHEN IT IS ADDED TO THE CART OR JUST REMOVED FROM THE WISHLIST

    const removeFromWishlist = async (event) => {
        try {

            const { accessTokenUserId, accessToken } = JSON.parse(sessionStorage.getItem("KicksNationz"));
            const response = await fetch(`//localhost:3000/removeFromWishlist/${accessTokenUserId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Basic ${accessToken}`
                },
                body: JSON.stringify({
                    position: event.target.id
                })
            });

            const data = await response.json();

            if (response.status === 200) {

                // The whole wishlist objest is currently stored in the state variable
                const wishlistObj = myWishlistDisplay;


                // console.log("Actual arr to work on: ",wishlistArr)
                // console.log("Id to be used for splicing: ",parseInt(event.target.id))


                const update = wishlistObj.wishlistCart.splice(parseInt(event.target.id), 1);

                // Storing the users wishlist in the statevariable if their wishlist exsists
                setMyWishlistDisplay(() => { return wishlistObj });

                console.log(data.message)
                // console.log("Wishlist length: ", wishlistObj.wishlistCart.length)

                // Setting the length of shoes found inside the users cart

                setNoOfShoes(() => { return wishlistObj.wishlistCart.length });


                return;
            } else {
                return alert(data.message);
            }
        }
        catch (error) {
            console.error("Error trying to remove a shoe from the wishlist: ", error)
        }
    }


    // ENDPOINT FUNCTION USED TO ADD A SHOE TO A CART

    const addToCart = async (event) => {

        try {

            // THE ID OF THE TARGETTED SHOE PLUS ITS INDEX CONCATENATED TO THE END 
            const idAndIndex = event.target.id;

            // EXTRACTING THE INDEX FROM THE CONCANTENATED STRING
            const filteredIndex = parseInt(idAndIndex.split("").slice(-1).join(""));
            // console.log("Filtered event index: ", filteredIndex);

            // EXTRACTING THE ID FROM THE CONCANTENATED STRING
            const filteredId = idAndIndex.split("").slice(0, -1).join("");
            console.log("Filtered event id: ", filteredId);

            // CURRENT WISHLIST THAT WE ARE WORKING WITH 
            // console.log( "The actual current my wishlist display: ",myWishlistDisplay);

            // FILTERING OUT THE SHOE THAT MUST BE REMOVED FROM THE WISHLIST AND ADDED TO THE CART
              const filteredShoe = myWishlistDisplay.wishlistCart.filter((shoe) => { return shoe.productId === filteredId });
            // console.log("Shoe to add to cart from wishlist: ", filteredShoe);

            // STORING OBJECT TO MUTATE INSIDE A VARIABLE
           const wholeWishlistObject = myWishlistDisplay

            // REMOVING THE SHOE FROM THE MAIN WISHLIST DISPLAY STATE VARIABLE
            const newWishlistDisplay = wholeWishlistObject.wishlistCart.splice(filteredIndex, 1);
            setMyWishlistDisplay(() => { return {...wholeWishlistObject} });
                    setNoOfShoes(() => { return (wholeWishlistObject.wishlistCart) ? wholeWishlistObject.wishlistCart.length : 0 });


                        // console.log( "whole wishlist display after the splite method: ", wholeWishlistObject);
                        // console.log( "The actual current my wishlist array display after the splite method: ",newWishlistDisplay);


                      const { accessTokenUserId, accessToken } = JSON.parse(sessionStorage.getItem("KicksNationz"));
            const response = await fetch(`//localhost:3000/editwishlist/${accessTokenUserId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    authorization: `Basic ${accessToken}`
                },
                body: JSON.stringify({
                    wishlistCart:  wholeWishlistObject.wishlistCart,
                    shoeObject: {
                        productId: filteredShoe[0].productId,
                        quantity: filteredShoe[0].quantity,
                        productName: filteredShoe[0].productName,
                        productType: filteredShoe[0].productType,
                        shoeColor: shoeColor,
                        productSize: filteredShoe[0].productSize,
                        currency: filteredShoe[0].currency,
                        price: filteredShoe[0].price,
                        imageUrls: filteredShoe[0].imageUrls,
                        //  We will just use the product id to get the current stock quantity
                        stockQuantity: filteredShoe[0].stockQuantity
                        // encodedEmail: filteredShoe[0].encodedEmail, 
                    },
                })
            });

            const data = await response.json();

            if( response.status !== 200 ){
                return alert( data.message );
            }

        else{
            console.log(data);
        }

        }
        catch (error) {
            console.error("There was an error trying to post yourshoe inside your shopping cart: ", error)
        }
    }



    return (
        <>
            <Navbar />
            <main className="wishlist_main">


                <section className="wishlist_header">

                    <div>
                        <h1>My Wishlist</h1>
                        <p> {(parseInt(noOfShoes) > 1) ? `${noOfShoes} items saved for later` : `${noOfShoes} items saved for later`}</p>
                    </div>

                    <button className="wishlist_moveAllBtn">
                        Move All to Cart
                    </button>

                </section>





{/* MAKING SURE THAT THE WISHLIST IS ONLY DISPLAYED WHEN THE THE ARE SHOES IN THE WISHLIST CART MEANING THAT THE WISHLIST CARTS'S LENGTH IS NOT EQUAL TO ZERO */}

                {noOfShoes !== 0 && myWishlistDisplay.wishlistCart.map((item, index) => {
                    return (<section className="wishlist_item" key={index}>


                        <div className="wishlist_productImages" id={index}>

                            <div className="wishlist_mainImage">
                                <img src={(selectedImage) ? selectedImage : item.imageUrls[0]} alt={item.productName} />
                            </div>

                            <div className="wishlist_thumbnailContainer">
                                {item.imageUrls.map((img, index) => {
                                    return (<section className="wishlist_thumbnail" key={`iimg${index}`}>
                                        <img src={img} alt={item.productName} onClick={handleImageDisplay} />
                                    </section>)
                                })}


                            </div>

                        </div>

                        <div className="wishlist_productInformation">

                            <h2>{item.productName} {item.productType}</h2>

                            <h3>R{item.price}</h3>

                            <p className="wishlist_productDescription">
                                The legend lives on in the Nike Air Force 1 '07
                            </p>

                            <div className="wishlist_productOption">

                                <p className="productDetails_shoeSelectedColor">Color: {(shoeColor) ? shoeColor : setShoeColor(() => { return item.productColor[0] })}</p>
                                <section className="productDetails_shoeColorSection">
                                    {item.productColor.map((itemColor) => {
                                        return (
                                            <div className="wishlist_color" key={itemColor} id={itemColor} style={{
                                                backgroundColor: itemColor.toLowerCase()

                                            }} onClick={(event) => { return setShoeColor(() => { return event.target.id }) }} ></div>
                                        )
                                    }
                                    )}
                                </section>

                            </div>

                            <div className="wishlist_productSize">
                                <span>Size: {item.productSize}</span>
                            </div>

                        </div>

                        <div className="wishlist_productActions">

                            {/* NED TO UPDATE WISHLIST ENDPOINT FOR EACH INDIVIDUAL SHOE */}
                            <div className="wishlist_addedDate">
                                <span>Added on {item.addedOn.split("").slice(0, 10).join("")}</span>
                            </div>


                            <h2 className="wishlist_productPrice">
                                R{item.price}
                            </h2>


                            <button className="wishlist_addToCartBtn" id={`${item.productId}${index}`} onClick={addToCart} >
                                Add to Cart
                            </button>


                            <button className="wishlist_removeBtn" onClick={removeFromWishlist} id={index} >
                                Remove
                            </button>

                        </div>

                    </section>)
                })}








                {/* <section className="wishlist_item">


                    <div className="wishlist_productImages">

                        <div className="wishlist_mainImage">
                            <img src="images/nike-air-force-1.jpg" alt="Nike Air Force 1" />
                        </div>

                        <div className="wishlist_thumbnailContainer">

                            <button className="wishlist_thumbnail wishlist_active">
                                <img src="images/nike-air-force-1.jpg" alt="Nike Air Force 1" />
                            </button>
                            <button className="wishlist_thumbnail">
                                <img src="images/nike-air-force-1.jpg" alt="Nike Air Force 1" />
                            </button>

                            <button className="wishlist_thumbnail">
                                <img src="images/nike-air-force-1.jpg" alt="Nike Air Force 1" />
                            </button>

                            <button className="wishlist_thumbnail">
                                <img src="images/nike-air-force-1.jpg" alt="Nike Air Force 1" />
                            </button>

                        </div>

                    </div>

                    <div className="wishlist_productInformation">

                        <h2>Nike Air Force 1</h2>

                        <h3>R1300</h3>

                        <p className="wishlist_productDescription">
                            The legend lives on in the Nike Air Force 1 '07,
                            a modern take on the icon that blends classic
                            style with all-day comfort.
                        </p>

                        <div className="wishlist_productOption">

                            <span>Color: White</span>

                            <div className="wishlist_colorOptions">

                                <button className="wishlist_color"></button>

                                <button className="wishlist_color"></button>

                                <button className="wishlist_color"></button>

                                <button className="wishlist_color"></button>

                            </div>

                        </div>

                        <div className="wishlist_productSize">
                            <span>Size: 8</span>
                        </div>

                    </div>

                    <div className="wishlist_productActions">

                        <div className="wishlist_addedDate">
                            <i className="fa-solid fa-heart"></i>
                            <span>Added on May 25, 2024</span>
                        </div>


                        <h2 className="wishlist_productPrice">
                            R1300
                        </h2>


                        <button className="wishlist_addToCartBtn">
                            Add to Cart
                        </button>


                        <button className="wishlist_removeBtn">
                            <i className="fa-regular fa-trash-can"></i>
                            Remove
                        </button>

                    </div>

                </section> */}

                <Footer2 />
            </main>
        </>
    );
}

export default Wishlist;