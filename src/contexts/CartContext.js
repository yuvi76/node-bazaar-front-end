import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export const CartContext = createContext();

const CartProvider = ({ children }) => {
  // cart state
  const [cart, setCart] = useState([]);
  const [cartId, setCartId] = useState(null);
  // item amount state
  const [itemAmount, setItemAmount] = useState(0);
  // total price state
  const [total, setTotal] = useState(0);
  const [isLogin, setIsLogin] = useState(false);

  // fetch cart
  useEffect(() => {
    if (isLogin) {
      const fetchCart = async () => {
        try {
          if (!localStorage.getItem("token")) {
            return;
          }
          const response = await fetch(
            `${process.env.REACT_APP_CART_BASE_URL}`,
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
          const cartData = data?.data?.products || [];
          setCartId(data?.data?._id);
          const newCart = cartData.map((item) => {
            return {
              _id: item.product._id,
              name: item.product.name,
              price: item.product.price,
              amount: item.quantity,
              image: item.product.image,
            };
          });
          setCart(newCart);
        } catch (error) {
          console.error("Error:", error);
          // Handle the error as needed
        }
      };
      fetchCart();
    } else {
      // Clear cart items when user is not authenticated
      setCart([]);
    }
  }, [isLogin]);

  useEffect(() => {
    const total = cart.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.price * currentItem.amount;
    }, 0);
    setTotal(total);
    // eslint-disable-next-line
  }, [cart]);

  // update item amount
  useEffect(() => {
    if (cart) {
      const amount = cart.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.amount;
      }, 0);
      setItemAmount(amount);
    }
  }, [cart]);

  // add to cart
  const addToCart = async (product, _id) => {
    const newItem = { ...product, amount: 1 };
    // check if the item is already in the cart
    const cartItem = cart.find((item) => {
      return item._id === _id;
    });
    if (cartItem) {
      const newCart = [...cart].map((item) => {
        if (item._id === _id) {
          return { ...item, amount: cartItem.amount + 1 };
        } else return item;
      });
      setCart(newCart);
    } else {
      setCart([...cart, newItem]);
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_CART_BASE_URL}/addProduct`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            product: _id,
            quantity: newItem.amount,
          }),
        }
      );

      const data = await response.json();
      if (data.statusCode === 403) {
        toast.error("Please login to add product to cart");
        setCart([]);
      }
      if (data.statusCode !== 200 && data.statusCode !== 403) {
        toast.error(data.message);
        setCart([]);
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle the error as needed
    }
  };

  // remove from cart
  const removeFromCart = async (_id) => {
    const newCart = cart.filter((item) => {
      return item._id !== _id;
    });
    setCart(newCart);

    // Call API
    try {
      const response = await fetch(
        `${process.env.REACT_APP_CART_BASE_URL}/removeProduct`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            productId: _id,
          }),
        }
      );

      const data = await response.json();
      if (data.statusCode === 403) {
        localStorage.removeItem("token");
        setCart([]);
        return;
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle the error as needed
    }
  };

  // cleart cart
  const clearCart = async () => {
    setCart([]);

    // Call API
    try {
      const response = await fetch(
        `${process.env.REACT_APP_CART_BASE_URL}/clear`,
        {
          method: "POST",
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
    } catch (error) {
      console.error("Error:", error);
      // Handle the error as needed
    }
  };

  // increase amount
  const increaseAmount = (_id) => {
    const cartItem = cart.find((item) => item._id === _id);
    addToCart(cartItem, _id);
  };

  // decrease amount
  const decreaseAmount = async (_id) => {
    const cartItem = cart.find((item) => item._id === _id);
    if (cartItem) {
      const newCart = cart.map((item) => {
        if (item._id === _id) {
          return { ...item, amount: cartItem.amount - 1 };
        } else {
          return item;
        }
      });
      setCart(newCart);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_CART_BASE_URL}/updateQuantity`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({
              productId: _id,
              quantity: cartItem.amount - 1,
            }),
          }
        );

        const data = await response.json();
        if (data.statusCode === 403) {
          localStorage.removeItem("token");
          setCart([]);
          return;
        }
      } catch (error) {
        console.error("Error:", error);
        // Handle the error as needed
      }
    }
    if (cartItem.amount < 2) {
      removeFromCart(_id);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseAmount,
        decreaseAmount,
        itemAmount,
        total,
        setIsLogin,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
