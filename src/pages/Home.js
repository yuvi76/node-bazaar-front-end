import React, { useContext } from "react";
import Hero from "../components/Home";
import { ProductContext } from "../contexts/ProductContext";
import Product from "../components/Product";
import Navbar from "../components/Navbar";
import ShoppingBag from "../components/ShoppingBag";
import Footer from "../components/Footer";
import Notification from "../components/Notification";
import OrderList from "../components/OrderList";

const Home = () => {
  const { products } = useContext(ProductContext);
  return (
    <div>
      <Navbar></Navbar>
      <Hero></Hero>
      <ShoppingBag></ShoppingBag>
      <Notification></Notification>
      <OrderList></OrderList>
      <section className="py-20">
        <div className="container mx-auto">
          <h1 className="text-3xl font-semibold mb-10 text-center">
            Explore Our Products
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 lg:mx-8 gap-[30px] max-w-sm mx-auto md:max-w-none md:mx-0">
            {products.map((product) => {
              return <Product product={product} key={product._id} />;
            })}
          </div>
        </div>
      </section>
      <Footer></Footer>
    </div>
  );
};

export default Home;
