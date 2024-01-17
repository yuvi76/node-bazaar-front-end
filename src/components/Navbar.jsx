import React, { useContext, useEffect, useState, useRef } from "react";
import { ShoppingBagContext } from "../contexts/ShoppingBagContext";
import { CartContext } from "../contexts/CartContext";
import { Link } from "react-router-dom";
import { BsBag, BsPerson, BsList, BsBell } from "react-icons/bs";
import LoginRegisterModal from "./LoginRegisterModal";
import { OrderListContext } from "../contexts/OrderListContext";
import { NotificationContext } from "../contexts/NotificationContext";

const Header = ({ value, onChangeData }) => {
  // header state
  const [isActive, setIsActive] = useState(false);
  const { isOpen, setIsOpen } = useContext(ShoppingBagContext);
  const { itemAmount, setIsLogin } = useContext(CartContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { isOrderListOpen, setIsOrderListOpen } = useContext(OrderListContext);
  const { isNotificationOpen, setIsNotificationOpen, setLogin } =
    useContext(NotificationContext);
  const menuRef = useRef();

  // event listener
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
    setIsLogin(!!token);
    setLogin(!!token);
    window.addEventListener("scroll", () => {
      window.scrollY > 60 ? setIsActive(true) : setIsActive(false);
    });
  });

  return (
    <header
      className={`${
        isActive ? "bg-white py-4 shadow-md" : "bg-none py-6"
      } fixed w-full z-10 lg:px-8 transition-all`}
    >
      <div className="container mx-auto flex items-center justify-between h-full">
        <Link to={"/"}>
          <div className="flex flex-row justify-center items-center gap-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-shopping-cart"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <span className="w-[40px] font-semibold text-xl">NodeBazaar</span>
          </div>
        </Link>

        {/* cart */}
        <div className="flex flex-row gap-4">
          <div
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            className="cursor-pointer flex relative"
          >
            <BsBag className="text-2xl" />
            <div className="bg-red-500 absolute -right-2 -bottom-0 text-[12px] w-[18px] h-[18px] text-white rounded-full flex justify-center items-center">
              {itemAmount}
            </div>
          </div>

          {isAuthenticated && (
            <div
              onClick={() => {
                setIsOrderListOpen(!isOrderListOpen);
              }}
              className="cursor-pointer flex relative"
            >
              <BsList className="text-2xl" />
            </div>
          )}

          {/* Notification Icon */}
          {isAuthenticated && (
            <div
              onClick={() => {
                setIsNotificationOpen(!isNotificationOpen);
              }}
              className="cursor-pointer flex relative"
            >
              <BsBell className="text-2xl" />
            </div>
          )}

          {isAuthenticated ? (
            <div>
              <Link onClick={() => setShowMenu(!showMenu)}>
                <BsPerson className="text-2xl" />
              </Link>
              {showMenu && (
                <div
                  ref={menuRef}
                  className="absolute bg-white text-black rounded mt-2 py-1 z-50"
                >
                  <Link
                    to={"/profile"}
                    className="block px-4 py-2 text-sm w-full text-left"
                  >
                    Profile
                  </Link>
                  <Link
                    className="block px-4 py-2 text-sm w-full text-left"
                    onClick={() => {
                      localStorage.removeItem("token");
                      setIsAuthenticated(false);
                      setShowMenu(false);
                    }}
                    to={"/"}
                  >
                    Logout
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <button
              className="bg-emerald-400 cursor-pointer rounded px-2 font-medium py-1 text-gray-800"
              onClick={() => setIsModalOpen(true)}
            >
              Login/Register
            </button>
          )}
          <LoginRegisterModal
            isOpen={isModalOpen}
            closeModal={() => setIsModalOpen(false)}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
