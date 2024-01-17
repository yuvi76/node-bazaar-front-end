import React from 'react'
import Category from '../components/Category' 
import Header from '../components/Navbar'
import ShoppingBag from "../components/ShoppingBag";
import Notification from "../components/Notification";
import OrderList from "../components/OrderList";

const CategoryPage = () => {
  return (
    <div>
      <Header></Header>
      <ShoppingBag></ShoppingBag>
      <Notification></Notification>
      <OrderList></OrderList>
        <Category></Category>
    </div>
  )
}

export default CategoryPage