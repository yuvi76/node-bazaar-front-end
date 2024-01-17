import React from "react";
import Profile from "../components/Profile";
import Header from "../components/Navbar";
import ShoppingBag from "../components/ShoppingBag";
import Notification from "../components/Notification";
import OrderList from "../components/OrderList";

const ProfilePage = () => {
  return (
    <div>
      <Header></Header>
      <ShoppingBag></ShoppingBag>
      <Notification></Notification>
      <OrderList></OrderList>
      <Profile></Profile>
    </div>
  );
};

export default ProfilePage;
