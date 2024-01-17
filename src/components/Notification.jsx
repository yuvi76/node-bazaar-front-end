import React, { useEffect, useRef, useContext } from "react";
import { IoMdArrowForward } from "react-icons/io";
import NotificationItem from "./NotificationItem";
import { NotificationContext } from "../contexts/NotificationContext";

const NotificationSidebar = () => {
  const {
    isNotificationOpen,
    handleCloseNotification,
    notification,
    markAsRead,
    setNotification,
    fetchMoreNotifications,
  } = useContext(NotificationContext);

  const sidebarRef = useRef();

  useEffect(() => {
    handleCloseNotification();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        // if (!isNotificationOpen) {
        //   document.body.style.overflow = "hidden";
        // } else {
        //   document.body.style.overflow = "auto";
        // }
        handleCloseNotification();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [handleCloseNotification, isNotificationOpen]);

  const handleMarkAllAsRead = async () => {
    await markAsRead();
    const updatedNotifications = notification.map((notification) => ({
      ...notification,
      isRead: true,
    }));
    setNotification(updatedNotifications);
  };

  const handleScroll = () => {
    const container = sidebarRef.current;

    // Check if the user has scrolled to the bottom of the page
    if (
      Math.round(container.scrollTop + container.clientHeight) ===
      container.scrollHeight
    ) {
      // User has scrolled to the bottom, fetch more notifications
      fetchMoreNotifications();
    }
  };

  return (
    <div
      ref={sidebarRef}
      onScroll={handleScroll}
      className={`${
        isNotificationOpen ? "right-0" : "-right-full"
      } w-full bg-white fixed top-0 h-full shadow-2xl md:w-[35vw] lg:w-[40vw] xl:max-w-[30vw] transition-all duration-300 z-40 px-4 lg:px-[35px] overflow-y-auto`}
    >
      <div className="flex items-center justify-between py-6 border-b">
        <div className="uppercase text-sm font-semibold">Notifications</div>
        {notification.length > 0 && (
          <div className="flex items-center">
            <button
              onClick={handleMarkAllAsRead}
              className="text-blue-500 hover:underline focus:outline-none"
            >
              Mark All as Read
            </button>
          </div>
        )}
        <div
          onClick={handleCloseNotification}
          className="cursor-pointer ml-3 w-8 h-8 flex justify-center items-center"
        >
          <IoMdArrowForward className="text-2xl cursor-pointer" />
        </div>
      </div>
      <div className="flex flex-col gap-y-2 overflow-y-auto flex-grow">
        {notification.map((notification) => (
          <NotificationItem key={notification._id} notification={notification} />
        ))}
      </div>
    </div>
  );
};

export default NotificationSidebar;
