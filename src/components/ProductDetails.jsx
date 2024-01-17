import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../contexts/CartContext";
import ShoppingBag from "./ShoppingBag";
import { ShoppingBagContext } from "../contexts/ShoppingBagContext";

import "react-toastify/dist/ReactToastify.css";

const ProductDetails = () => {
  // get the product id from url
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { isOpen, setIsOpen } = useContext(ShoppingBagContext);
  const [product, setProduct] = React.useState({});

  //get the single product based on id
  useEffect(() => {
    async function fetchData() {
      try {
        const productResponse = await fetch(
          `${process.env.REACT_APP_PRODUCT_BASE_URL}/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await productResponse.json();
        setProduct(data.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }

    fetchData();
  }, [id]);

  // if product is not found
  if (!product._id) {
    return (
      <section className="h-screen flex justify-center items-center">
        Loading...
      </section>
    );
  }

  // destructure product
  const { name, price, description, image } = product;
  return (
    <section className="pt-[450px] md:pt-32 pb-[400px] md:pb-12 lg:py-32 h-screen flex items-center">
      <ShoppingBag></ShoppingBag>
      <div className="container mx-auto">
        {/* image and text wrapper */}
        <div className="flex flex-col lg:flex-row items-center">
          {/* image */}
          <div className="flex flex-1 justify-center items-center mb-8 lg:mb-0">
            <img className="max-w-[200px] lg:max-w-xs" src={image[0]} alt="" />
          </div>
          {/* text */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-[26px] font-medium mb-2 max-w-[450px] mx-auto lg:mx-0">
              {name}
            </h1>
            <div className="text-2xl text-red-500 font-medium mb-6">
              $ {price}
            </div>
            <p className="mb-8">{description}</p>
            <button
              onClick={() => {
                addToCart(product, product._id);
              }}
              className="bg-primary py-4 px-8 text-white"
            >
              Add to cart
            </button>
            <button
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              className="bg-gray-200 py-4 px-8 ml-2 text-black font-medium"
            >
              View Cart
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
