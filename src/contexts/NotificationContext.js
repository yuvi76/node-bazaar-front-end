import React, { useState, createContext, useEffect } from "react";

export const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [login, setLogin] = useState(false);
  const [notification, setNotification] = useState([]); // Replace initialNotifications with your initial data
  const [page, setPage] = useState(1);

  // fetch notification
  useEffect(() => {
    if (login) {
      const fetchNotification = async () => {
        try {
          if (!localStorage.getItem("token")) {
            return;
          }
          const response = await fetch(
            `${process.env.REACT_APP_NOTIFICATION_BASE_URL}/getAllNotifications`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                page: 1,
                limit: 20,
              }),
            }
          );

          const data = await response.json();
          if (data.statusCode === 403) {
            localStorage.removeItem("token");
            return;
          }
          const notificationData = data.data.notifications;
          const newNotification = notificationData.map((item) => {
            return {
              _id: item._id,
              type: item.type,
              message: item.message,
              isRead: item.isRead,
              createdAt: item.createdAt,
            };
          });
          setNotification(newNotification);
        } catch (error) {
          console.error("Error:", error);
          // Handle the error as needed
        }
      };
      fetchNotification();
    } else {
      setNotification([]);
    }
  }, [login]);

  const fetchMoreNotifications = async () => {
    try {
      // Simulate fetching more notifications from an API
      const response = await fetch(
        `${process.env.REACT_APP_NOTIFICATION_BASE_URL}/getAllNotifications`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            page: page + 1,
            limit: 20,
          }),
        }
      );
      const data = await response.json();

      // Append the new notifications to the existing ones
      setNotification((prevNotifications) => [
        ...prevNotifications,
        ...data.data.notifications,
      ]);

      // Increment the page number
      setPage(page + 1);
    } catch (error) {
      console.error("Error fetching more notifications:", error);
    }
  };

  // mark as read
  const markAsRead = async (_id) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_NOTIFICATION_BASE_URL}/MarkAllAsRead`,
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
      const notificationData = data.data.notifications;
      const newNotification = notificationData.map((item) => {
        return {
          _id: item._id,
          type: item.type,
          message: item.message,
          isRead: item.isRead,
          createdAt: item.createdAt,
        };
      });
      setNotification(newNotification);
    } catch (error) {
      console.error("Error:", error);
      // Handle the error as needed
    }
  };

  const handleCloseNotification = () => {
    setIsNotificationOpen(false);
  };

  return (
    <NotificationContext.Provider
      value={{
        isNotificationOpen,
        setIsNotificationOpen,
        handleCloseNotification,
        setLogin,
        notification,
        setNotification,
        markAsRead,
        fetchMoreNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
