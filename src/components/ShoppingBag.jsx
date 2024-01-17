import React, { useEffect, useRef, useContext } from "react";
import { IoMdArrowForward } from "react-icons/io";
import { FiTrash2 } from "react-icons/fi";

import CartItem from "./CartItem";
import { ShoppingBagContext } from "../contexts/ShoppingBagContext";
import { CartContext } from "../contexts/CartContext";
import { OrderContext } from "../contexts/OrderContext";

const ShoppingBag = () => {
  const { isOpen, handleClose } = useContext(ShoppingBagContext);
  const { cart, clearCart, itemAmount, total } = useContext(CartContext);
  const { placeOrder } = useContext(OrderContext);

  const sidebarRef = useRef(); // Create a ref

  useEffect(() => {
    handleClose();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        // if (!isOpen) {
        //   document.body.style.overflow = "hidden";
        // } else {
        //   document.body.style.overflow = "auto";
        // }
        handleClose();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleClose, isOpen]);

  const checkOut = async () => {
    await placeOrder();
    await clearCart();
  };

  return (
    <div
      ref={sidebarRef} // Attach the ref
      className={`${
        isOpen ? "right-0" : "-right-full"
      } "w-full bg-white fixed top-0 h-full shadow-2xl md:w-[35vw] lg:w-[40vw] xl:max-w-[30vw] transition-all duration-300 z-40 px-4 lg:px-[35px]"`}
    >
      <div className="flex items-center justify-between py-6 border-b">
        <div className="uppercase text-sm font-semibold">
          Shopping Bag ({itemAmount})
        </div>
        <div
          onClick={handleClose}
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
        {cart.map((item) => {
          return <CartItem item={item} key={item._id} />;
        })}
      </div>
      {itemAmount > 0 && (
        <div className="flex flex-col gap-y-3  mt-4">
          <div className="flex w-full justify-between items-center">
            {/* total */}
            <div className="font-semibold">
              <span className="mr-2">Subtotal:</span> ${" "}
              {parseFloat(total).toFixed(2)}
            </div>
            {/* clear cart icon */}
            <div
              onClick={clearCart}
              className="cursor-pointer py-4 bg-red-500 text-white w-12 h-12 flex justify-center items-center text-xl"
            >
              <FiTrash2 />
            </div>
          </div>
          <button
            onClick={checkOut}
            className="bg-primary flex p-3 justify-center items-center text-white w-full font-medium"
          >
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default ShoppingBag;
