import React from "react";
import ProductDetails from "../components/ProductDetails";
import Header from "../components/Navbar";
import Footer from "../components/Footer";
import ShoppingBag from "../components/ShoppingBag";
import Notification from "../components/Notification";
import OrderList from "../components/OrderList";

const ProductDetailsPage = () => {
  return (
    <div>
      <Header></Header>
      <ShoppingBag></ShoppingBag>
      <Notification></Notification>
      <OrderList></OrderList>
      <ProductDetails></ProductDetails>
      <Footer></Footer>
    </div>
  );
};

export default ProductDetailsPage;
