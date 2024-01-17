import React, { useContext, useState } from "react";
import Modal from "react-modal";
import { LoginRegisterContext } from "../contexts/LoginRegisterContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginRegisterModal = ({ isOpen, closeModal }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Login");
  const {
    loginData,
    setLoginData,
    loginErrors,
    registerData,
    setRegisterData,
    registerErrors,
    resetLoginData,
    resetRegisterData,
    validateLogin,
    validateRegister,
  } = useContext(LoginRegisterContext);

  const handleCloseModal = () => {
    closeModal();
    resetLoginData();
    resetRegisterData();
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetLoginData();
    resetRegisterData();
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    if (validateLogin()) {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_AUTH_BASE_URL}/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(loginData),
          }
        );

        const data = await response.json();

        if (data.statusCode === 200) {
          toast.success(data.message);
          localStorage.setItem("token", data.data.accessToken);
          // Close modal
          closeModal();
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error:", error);
        // Show toast message with error message
        toast.error(error.message);
      }
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (validateRegister()) {
      const response = await fetch(
        `${process.env.REACT_APP_AUTH_BASE_URL}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(registerData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        // Close modal
        closeModal();
        // Navigate to dashboard
        navigate("/dashboard");
      } else {
        toast.error(data.message);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleCloseModal}
      shouldCloseOnOverlayClick={true}
      contentLabel="Login/Register Modal"
      className="fixed inset-0 flex items-center justify-center outline-none"
      style={{
        overlay: { backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000 },
      }}
    >
      <div className="relative bg-[#20354b] p-6 rounded-2xl shadow-md w-80">
        <button
          onClick={handleCloseModal}
          className="absolute top-0 right-0 m-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
        >
          X
        </button>
        <h2 className="text-emerald-400 text-2xl mb-6">{activeTab}</h2>

        <div className="flex justify-between mb-4">
          <button
            className={`w-1/2 text-center py-2 ${
              activeTab === "Login"
                ? "text-emerald-400 border-b-2 border-emerald-400"
                : "text-gray-400"
            }`}
            onClick={() => handleTabChange("Login")}
          >
            Login
          </button>
          <button
            className={`w-1/2 text-center py-2 ${
              activeTab === "Register"
                ? "text-emerald-400 border-b-2 border-emerald-400"
                : "text-gray-400"
            }`}
            onClick={() => handleTabChange("Register")}
          >
            Register
          </button>
         
        </div>
        {activeTab === "Login" ? (
          <form className="space-y-4">
            <input
              className="w-full p-2 border rounded"
              type="text"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
            />
            {loginErrors.email && <p>{loginErrors.email}</p>}
            <input
              className="w-full p-2 border rounded"
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />
            {loginErrors.password && <p>{loginErrors.password}</p>}
            <button
              className="bg-emerald-400 py-1 cursor-pointer rounded font-semibold mt-2.5 w-full text-gray-800"
              onClick={handleLogin}
            >
              Login
            </button>
          </form>
        ) : (
          <form className="space-y-4">
            <input
              className="w-full p-2 border rounded"
              type="text"
              placeholder="Name"
              value={registerData.name}
              onChange={(e) =>
                setRegisterData({ ...registerData, name: e.target.value })
              }
            />
            {registerErrors.name && <p>{registerErrors.name}</p>}
            <input
              className="w-full p-2 border rounded"
              type="text"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
            />
            {registerErrors.email && <p>{registerErrors.email}</p>}
            <input
              className="w-full p-2 border rounded"
              type="password"
              placeholder="Password"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
            />
            {registerErrors.password && <p>{registerErrors.password}</p>}
            <input
              className="w-full p-2 border rounded"
              type="password"
              placeholder="Confirm Password"
              value={registerData.confirmPassword}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  confirmPassword: e.target.value,
                })
              }
            />
            {registerErrors.confirmPassword && (
              <p>{registerErrors.confirmPassword}</p>
            )}
            <button
              className="bg-emerald-400 py-1 cursor-pointer rounded font-semibold mt-2.5 w-full text-gray-800"
              onClick={handleRegister}
            >
              Register
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default LoginRegisterModal;
