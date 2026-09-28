import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar = () => {
  // USEREF USED TO TARGET THE UL TO BE DISPLAYED DURING THE 490 MEDIA QUERRY FOR THE HAMBURGER NAVBAR
  const navBar_ul = useRef();

//   USED TO TARGET THE SECTION OF THE NAVBAR FOR THE DISPLAY OF THE HAMBURGER NAVBAR DURING THE 490 MEDIA QUERRY
  const nav_section = useRef();

  // STATE VALUE THAT KEEPS TRACK OF WEATHER THE NAVBAR IS DISPLAYED OR NOT
  const [isNavHidden, setIsNavHidden] = useState(true);

  // DISPLAY THE NAVBAR DURING THE 490 MEDIA QUERRY
  const handleNavDisplay = () => {
    // console.log("Function is being called")
    navBar_ul.current.classList.toggle("navbar_display");
    nav_section.current.classList.toggle("section_border");
  };



  return (
    <>
      <nav>
        <section className="nav_section" ref={nav_section}>
          <h2>Kicks Nationz</h2>
          <svg
            onClick={() => {
              return handleNavDisplay();
            }}
            className="nav_svg"
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 48 48"
          >
            <path d="M0 0h48v48H0z" fill="none" />
            <path
              fill="none"
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M5.5 24h37m-37 13h37m-37-26h37"
            />
          </svg>
        </section>
        <ul className="navbar_ul" ref={navBar_ul}>
          <li className="navbar_li">
            <Link to="/" className="navbarLinks">
              Products
            </Link>
          </li>
          <li className="navbar_li">
            <Link to="/Cart" className="navbarLinks">
              Cart
            </Link>
          </li>
          <li className="navbar_li">
            <Link to="/Wishlist" className="navbarLinks">
              Wishlist
            </Link>
          </li>
          {/* <li className="navbar_li"><Link to="/Checkout" className="navbarLinks" >Checkout</Link></li> */}
          <li className="navbar_li">
            <Link to="/OrderStatus" className="navbarLinks">
              Order Status
            </Link>
          </li>
          <li className="navbar_li">
            <Link to="/ContactUs" className="navbarLinks">
              Contact Us
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Navbar;
