import React, { createContext } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const OrderContext = createContext();

const OrderProvider = ({ children }) => {
  const placeOrder = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_ORDER_BASE_URL}/placeOrder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await response.json();

      // Assuming the checkout URL is present in the 'data' response, replace 'checkoutUrl' with the actual key containing the URL
      const checkoutUrl = data.checkoutUrl;

      // Open the checkout URL in a new tab
      if (checkoutUrl) {
        window.open(checkoutUrl, "_blank");
      } else {
        // Handle the case where the checkout URL is not present in the response
        console.error("Error: Checkout URL not found in response");
        // You may want to show a toast or display an error message to the user
        toast.error("Error: Checkout URL not found in response");
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle the error as needed
    }
  };

  return (
    <OrderContext.Provider value={{ placeOrder }}>
      {children}
    </OrderContext.Provider>
  );
};

export default OrderProvider;
