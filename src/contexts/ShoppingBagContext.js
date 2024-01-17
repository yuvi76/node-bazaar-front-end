import React, { useState, createContext } from "react";

export const ShoppingBagContext = createContext();

const ShoppingBagProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <ShoppingBagContext.Provider value={{ isOpen, setIsOpen, handleClose }}>
      {children}
    </ShoppingBagContext.Provider>
  );
};

export default ShoppingBagProvider;
