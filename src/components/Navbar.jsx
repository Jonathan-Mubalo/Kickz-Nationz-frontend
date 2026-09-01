import React from 'react';
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
    return ( <>
<nav >
    <h2>Kicks Nationz</h2>
    <ul className="navbar_ul">
        <li className="navbar_li"><Link to="/" className="navbarLinks" >Products</Link></li>
        <li className="navbar_li"><Link to="/Cart" className="navbarLinks" >Cart</Link></li>
        <li className="navbar_li"><Link to="/Wishlist" className="navbarLinks" >Wishlist</Link></li>
        {/* <li className="navbar_li"><Link to="/Checkout" className="navbarLinks" >Checkout</Link></li> */}
        <li className="navbar_li"><Link to="/OrderStatus" className="navbarLinks" >Order Status</Link></li>
        <li className="navbar_li"><Link to="/ContactUs" className="navbarLinks" >Contact Us</Link></li>
    </ul>
</nav>
    </> 
    );
}
 
export default Navbar;