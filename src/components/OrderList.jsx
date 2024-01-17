import React, { useEffect, useRef, useContext } from "react";
import { IoMdArrowForward } from "react-icons/io";
import { OrderListContext } from "../contexts/OrderListContext";
import OrderItem from "./OrderItem"; // Assuming you have an OrderItem component

const OrderList = () => {
  const { isOrderListOpen, handleCloseOrderList, orderList } =
    useContext(OrderListContext);

  const orderListRef = useRef();

  useEffect(() => {
    handleCloseOrderList();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        orderListRef.current &&
        !orderListRef.current.contains(event.target)
      ) {
        // if (!isOrderListOpen) {
        //   document.body.style.overflow = "hidden";
        // } else {
        //   document.body.style.overflow = "auto";
        // }
        handleCloseOrderList();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleCloseOrderList, isOrderListOpen]);

  return (
    <div
      ref={orderListRef}
      className={`${
        isOrderListOpen ? "right-0" : "-right-full"
      } w-full bg-white fixed top-0 h-full shadow-2xl md:w-[35vw] lg:w-[40vw] xl:max-w-[30vw] transition-all duration-300 z-40 px-4 lg:px-[35px] overflow-y-auto`}
    >
      <div className="flex items-center justify-between py-6 border-b">
        <div className="uppercase text-sm font-semibold">Order List</div>
        <div
          onClick={handleCloseOrderList}
          className="cursor-pointer w-8 h-8 flex justify-center items-center"
        >
          <IoMdArrowForward className="text-2xl cursor-pointer" />
        </div>
      </div>
      <div
        className={`flex flex-col gap-y-2 h-[${
          window.innerHeight * 0.6 - 56
        }px] md:h-[${window.innerHeight * 0.8 - 56}px] lg:h-[${
          window.innerHeight * 0.7 - 56
        }px] overflow-y-auto overflow-x-hidden border-b`}
      >
        {/* Render order items */}
        {/* Assuming you have an OrderItem component */}
        {orderList.map((order) => (
          <OrderItem key={order._id} order={order} />
        ))}
      </div>
    </div>
  );
};

export default OrderList;
