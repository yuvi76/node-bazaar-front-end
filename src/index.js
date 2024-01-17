import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import CartContextProvider from "./contexts/CartContext";
import ShoppingBagContextProvider from "./contexts/ShoppingBagContext";
import { LoginRegisterProvider } from "./contexts/LoginRegisterContext";
import OrderProvider from "./contexts/OrderContext";
import OrderListProvider from "./contexts/OrderListContext";
import NotificationContextProvider from "./contexts/NotificationContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ShoppingBagContextProvider>
    <NotificationContextProvider>
      <OrderListProvider>
        <CartContextProvider>
          <LoginRegisterProvider>
            <React.StrictMode>
              <OrderProvider>
                <App />
              </OrderProvider>
            </React.StrictMode>
          </LoginRegisterProvider>
        </CartContextProvider>
      </OrderListProvider>
    </NotificationContextProvider>
  </ShoppingBagContextProvider>
);

reportWebVitals();
