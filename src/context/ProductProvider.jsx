
import React, { useState, createContext, useEffect } from "react";
import { decode } from "base-64"

export const ProductContext = createContext();

const ProductProvider = (props) => {

    const [allProducts, setAllProducts] = useState();
    const [filteredId, setFilteredId] = useState();
    const [storedUserId, setStoredUserId] = useState("No storedUserId yet");
    const [isLoggedIn, setIsLoggedIn] = useState();

    useEffect(() => {

        const getAllProducts = async () => {
            try {

                const { accessToken } = JSON.parse(sessionStorage.getItem("KicksNationz"));
             
                // DEBUGGING
                console.log("accessToken: ",accessToken)
              const decodedToken = decode(accessToken);
              console.log("decodedToken: ",decodedToken)

                const response = await fetch('//localhost:3000/products',{
                    method: 'GET',
                    headers: {
                        authorization: `Basic ${accessToken}`
                    }
                });
                const data = await response.json();

                if (response.status === 404) {
                    return allProducts(() => {
                        return [{
                            _id: "N/A",
                            shoeType: "N/A",

                            shoeType: "N/A",
                            price: "N/A",
                            imageUrls: ["N/A"],
                            productColor: ["N/A"],
                            productName: "N/A",
                            productSize: "N/A",
                            stockQuantity: "N/A"
                        }, {
                            _id: "N/A",
                            shoeType: "N/A",

                            shoeType: "N/A",
                            price: "N/A",
                            imageUrls: ["N/A"],
                            productColor: ["N/A"],
                            productName: "N/A",
                            productSize: "N/A",
                            stockQuantity: "N/A"
                        }, {
                            _id: "N/A",
                            shoeType: "N/A",

                            shoeType: "N/A",
                            price: "N/A",
                            imageUrls: ["N/A"],
                            productColor: ["N/A"],
                            productName: "N/A",
                            productSize: "N/A",
                            stockQuantity: "N/A"
                        }, {
                            _id: "N/A",
                            shoeType: "N/A",

                            shoeType: "N/A",
                            price: "N/A",
                            imageUrls: ["N/A"],
                            productColor: ["N/A"],
                            productName: "N/A",
                            productSize: "N/A",
                            stockQuantity: "N/A"
                        }, {
                            _id: "N/A",
                            shoeType: "N/A",

                            shoeType: "N/A",
                            price: "N/A",
                            imageUrls: ["N/A"],
                            productColor: ["N/A"],
                            productName: "N/A",
                            productSize: "N/A",
                            stockQuantity: "N/A"
                        }, {
                            _id: "N/A",
                            shoeType: "N/A",

                            shoeType: "N/A",
                            price: "N/A",
                            imageUrls: ["N/A"],
                            productColor: ["N/A"],
                            productName: "N/A",
                            productSize: "N/A",
                            stockQuantity: "N/A"
                        },]
                    })
                }

                setAllProducts(() => { return data.message })
                console.log(data.message);
            }
            catch (error) {
                console.error("There was an error in Context  when trying to get all of the shoes: ", error)
            }
        }
        getAllProducts();

    }
        , [])

    return (
        <>
            <ProductContext.Provider value={{ allProducts, setAllProducts, storedUserId, setStoredUserId, isLoggedIn, setIsLoggedIn, filteredId, setFilteredId }}>
                {props.children}
            </ProductContext.Provider>
        </>
    );
}


export default ProductProvider;
