import React, { createContext, useState } from "react";

// Create a context
export const LoginRegisterContext = createContext();

// Create a context provider
export const LoginRegisterProvider = ({ children }) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [loginErrors, setLoginErrors] = useState({
    email: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [registerErrors, setRegisterErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const resetLoginData = () => {
    setLoginData({ email: "", password: "" });
    setLoginErrors({ email: "", password: "" });
  };

  const resetRegisterData = () => {
    setRegisterData({ name: "", email: "", password: "", confirmPassword: "" });
    setRegisterErrors({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  };

  const validateLogin = () => {
    let errors = { email: "", password: "" };

    if (!loginData.email) {
      errors.email = "Email is required.";
    }

    if (!loginData.password) {
      errors.password = "Password is required.";
    }

    setLoginErrors(errors);

    // Only proceed with login if there are no errors
    return !errors.email && !errors.password;
  };

  const validateRegister = () => {
    let errors = { name: "", email: "", password: "", confirmPassword: "" };

    if (!registerData.name) {
      errors.name = "Name is required.";
    }

    if (!registerData.email) {
      errors.email = "Email is required.";
    }

    if (!registerData.password) {
      errors.password = "Password is required.";
    }

    if (!registerData.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required.";
    } else if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    setRegisterErrors(errors);

    // Only proceed with registration if there are no errors
    return !errors.name && !errors.email && !errors.password && !errors.email;
  };

  const resetFormData = () => {
    setLoginData({ email: "", password: "" });
    setRegisterData({ name: "", email: "", password: "", confirmPassword: "" });
  };

  return (
    <LoginRegisterContext.Provider
      value={{
        loginData,
        setLoginData,
        loginErrors,
        setLoginErrors,
        registerData,
        setRegisterData,
        registerErrors,
        setRegisterErrors,
        resetLoginData,
        resetRegisterData,
        validateLogin,
        validateRegister,
        resetFormData,
      }}
    >
      {children}
    </LoginRegisterContext.Provider>
  );
};
export default LoginRegisterProvider;
