import React, { useState, useEffect, useContext } from "react";
import Product from "./Product";
import { ProductContext } from "../contexts/ProductContext";

const Category = () => {
  const [category, setCategory] = useState([]);
  const { products } = useContext(ProductContext);
  const [categoryProducts, setCategoryProducts] = useState([]);

  useEffect(() => {
    const getCategory = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_CATEGORY_BASE_URL}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      setCategory(data.data);
    };
    getCategory();
    setCategoryProducts(products);
  }, [products]);

  const filterProduct = async (categoryId) => {
    const productWithCategory = await fetch(
      `${process.env.REACT_APP_PRODUCT_BASE_URL}/category/${categoryId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page: 1,
          limit: 10,
          minPrice: 0,
          maxPrice: 1000,
          minRating: 0,
        }),
      }
    );
    const data = await productWithCategory.json();
    setCategoryProducts(data.data.products);
  };

  return (
    <div>
      <section className="py-14">
        <div className="fixed py-2 bg-white shadow-lg flex fex-row items-center mx-auto w-full z-20 justify-center">
          <button
            className="btn btn-outline-dark p-2 bg-black text-white rounded  m-1 btn-sm"
            onClick={() => setCategoryProducts(products)}
          >
            All
          </button>
          {category.map((category) => {
            return (
              <button
                key={category._id}
                className="btn btn-outline-dark p-2 bg-black text-white rounded  m-1 btn-sm"
                onClick={() => filterProduct(category._id)}
              >
                {category.name}
              </button>
            );
          })}
        </div>
        <div className="container mx-auto py-20">
          <h1 className="text-3xl font-semibold mb-10 text-center">
            Explore Our Products
          </h1>
          {categoryProducts.length === 0 ? (
            <p>No products available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 lg:mx-8 gap-[30px] max-w-sm mx-auto md:max-w-none md:mx-0">
              {categoryProducts.map((product) => {
                return <Product product={product} key={product.id} />;
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Category;
