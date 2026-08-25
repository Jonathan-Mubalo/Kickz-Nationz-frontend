import React, { useState, useEffect, useContext } from 'react';
import Login from "./pages/Login.jsx";
import ProductProvider from "./context/ProductProvider.jsx";
import "./styles/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductDetails from "./pages/ProductDetails.jsx"
import Products from "./pages/Products.jsx"
import ProtectedRoutes from './authentication/ProtectedRoutes.jsx';
import Signup from "./pages/Signup.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import Wishlist from './pages/Wishlist.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import OrderStatus from './pages/OrderStatus.jsx';
import ContactUs from './pages/ContactUs.jsx';


function App() {


  return (

    <>
      <BrowserRouter>
        <Routes>
          
          <Route path="*" element={<PageNotFound />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />

          <Route path="/" element={<ProtectedRoutes>
            <ProductProvider>
              <Products />
            </ProductProvider>
          </ProtectedRoutes>
          } />

          <Route path="/ProductDetails" element={<ProtectedRoutes>
            <ProductProvider>
              <ProductDetails />
            </ProductProvider>
          </ProtectedRoutes>} />

          <Route path="/Wishlist" element={<ProtectedRoutes>
            <Wishlist />
          </ProtectedRoutes>} />

           <Route path="/Cart" element={<ProtectedRoutes>
            <Cart />
          </ProtectedRoutes>} />

          <Route path="/Checkout" element={<ProtectedRoutes>
            <Checkout />
          </ProtectedRoutes>} />

           <Route path="/OrderStatus" element={<ProtectedRoutes>
            <OrderStatus />
          </ProtectedRoutes>} />

           <Route path="/ContactUs" element={<ProtectedRoutes>
            <ContactUs />
          </ProtectedRoutes>} />

        </Routes>
      </BrowserRouter>

    </>

  )
}

export default App;
