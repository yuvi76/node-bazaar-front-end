import React from "react";

const NotificationItem = ({ notification }) => {
  const notificationClass = notification.isRead ? "read" : "unread";

  return (
    <div className={`flex items-center border-b py-3 ${notificationClass}`}>
      <div
        className={`flex-shrink-0 w-2 h-2 ${
          notificationClass === "read" ? "bg-gray-300" : "bg-blue-500"
        } rounded-full`}
      ></div>
      <div
        className={`flex-grow flex ${
          notificationClass === "read" ? "text-gray-500" : "text-gray-800"
        }`}
      >
        <p className="text-sm font-medium">{notification.type}</p>
        <p className="text-xs">{notification.message}</p>
      </div>
      <div className="text-xs text-gray-400">
        {new Date(notification.createdAt).toLocaleString()}
      </div>
    </div>
  );
};

export default NotificationItem;
