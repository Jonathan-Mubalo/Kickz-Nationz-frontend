import React, {useRef, useContext } from 'react';
import "../styles/Products.css"
import  { ProductContext } from '../context/ProductProvider.jsx'
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import Footer2 from "../components/Footer2.jsx";


const  Products = () => {

    const logOut = useRef();
//Usedto redirect a shopper to the product details component when a shoe is selected
   const navigate = useNavigate();

//CONTEXT VALUE THAT IS STORING ALL OF THE AVAILABLE SHOES
const { allProducts, setFilteredId } = useContext(ProductContext);


const handleLogOut = () =>{
   
   
    sessionStorage.setItem("login", JSON.stringify({"isLoggedIn":false}));
const access = JSON.parse(sessionStorage.getItem("login"));

    console.log( " Home Page Log out: "+ access.isLoggedIn)

    navigate("/Login")
}

const displayProductDetails = (event) =>{
      setFilteredId( () =>{ return event.target.id; });
       navigate("/ProductDetails");
}

    return (  
<>
<Navbar />
<h1 className="products_h1">Products</h1>
<p className="products_p">Explore our latest collection of premium sneakers</p>
<main className="products_main">
{allProducts && allProducts.map( (item)=>{
       return(<section className="productsSection" key={item["_id"]} >
       <div className="product_image_div"><img className="productImg" src={item.imageUrls[0]} /></div>
       <h2 className="products_h2">{item.productName} {item.shoeType}</h2>
       <h2 className="products_h2"><span>R{item.price}</span></h2>
       <button className="productsBtn" id={item["_id"]} onClick={displayProductDetails} >View product</button>
       </section>
       )
})}

{/* <section className="productsSection">
       <div className="product_image_div"><img className="productImg" src="" /></div>
       <h2 className="products_h2">Nike airforce 1</h2>
       <h2 className="products_h2"><span>R1000</span></h2>
       <button className="productsBtn">View product</button>
</section>
<section className="productsSection">
       <div className="product_image_div"><img src="" /></div>
       <h2 className="products_h2">Nike airforce 1</h2>
       <h2 className="products_h2"><span>R1000</span></h2>
       <button className="productsBtn">View product</button>
</section>
<section className="productsSection">
       <div className="product_image_div"><img src="" /></div>
       <h2 className="products_h2">Nike airforce 1</h2>
       <h2 className="products_h2"><span>R1000</span></h2>
       <button className="productsBtn">View product</button>
</section>
<section className="productsSection">
       <div className="product_image_div"><img src="" /></div>
       <h2 className="products_h2">Nike airforce 1</h2>
       <h2 className="products_h2"><span>R1000</span></h2>
       <button className="productsBtn">View product</button>
</section>
<section className="productsSection">
       <div className="product_image_div"><img src="" /></div>
       <h2 className="products_h2">Nike airforce 1</h2>
       <h2 className="products_h2"><span>R1000</span></h2>
       <button className="productsBtn">View product</button>
</section>
<section className="productsSection">
       <div className="product_image_div"><img src="" /></div>
       <h2 className="products_h2">Nike airforce 1</h2>
       <h2 className="products_h2"><span>R1000</span></h2>
       <button className="productsBtn">View product</button>
</section>
<section className="productsSection">
       <div className="product_image_div"><img src="" /></div>
       <h2 className="products_h2">Nike airforce 1</h2>
       <h2 className="products_h2"><span>R1000</span></h2>
       <button className="productsBtn">View product</button>
</section> */}
</main>
<Footer2 />
</>
    );
}
 
export default Products;