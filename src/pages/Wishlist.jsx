import React from 'react';
import Navbar from '../components/Navbar';
import Footer2 from '../components/Footer2';
import '../styles/Wishlist.css'

const Wishlist = () => {
    return (
        <>
            <Navbar />
            <main className="wishlist_main">


                <section className="wishlist_header">

                    <div>
                        <h1>My Wishlist</h1>
                        <p>1 item saved for later</p>
                    </div>

                    <button className="wishlist_moveAllBtn">
                        <i className="fa-regular fa-heart"></i>
                        Move All to Cart
                    </button>

                </section>



                <section className="wishlist_item">


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

                </section>

                <Footer2 />
            </main>
        </>
    );
}

export default Wishlist;