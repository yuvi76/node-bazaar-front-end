import React, { useState, createContext, useEffect } from "react";

export const OrderListContext = createContext();

const OrderListProvider = ({ children }) => {
  const [isOrderListOpen, setIsOrderListOpen] = useState(false);
  const [orderList, setOrderList] = useState([]);

  const handleCloseOrderList = () => {
    setIsOrderListOpen(false);
  };

  useEffect(() => {
    const fetchOrderList = async () => {
      try {
        if (!localStorage.getItem("token")) {
          return;
        }
        const response = await fetch(
          `${process.env.REACT_APP_ORDER_BASE_URL}/getAllOrders`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const data = await response.json();
        if (data.statusCode === 403) {
          localStorage.removeItem("token");
          return;
        }
        const orderData = data.data;
       
        setOrderList(orderData);
      } catch (error) {
        console.error("Error:", error);
        // Handle the error as needed
      }
    };
    fetchOrderList();
  }, []);

  return (
    <OrderListContext.Provider
      value={{
        isOrderListOpen,
        setIsOrderListOpen,
        handleCloseOrderList,
        orderList,
      }}
    >
      {children}
    </OrderListContext.Provider>
  );
};

export default OrderListProvider;
