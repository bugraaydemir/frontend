import { useState } from "react";
import { useSelector } from "react-redux";
import UserImage from "components/UserImage";
import "./style.css";
import { useTheme } from "@emotion/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const NotificationBarWidget = ({ notificationId, postId, picturePath, onNewNotification }) => {
  const ownerId = useSelector((state) => state.user._id);
  const [notifications, setNotifications] = useState([]);
  const token = useSelector((state) => state.token);
  const [notification, setNotificationRead] = useState(null);
  const { palette } = useTheme();
  const navigate = useNavigate();
  const medium = palette.neutral.medium;
  const alt = palette.background.alt;


  //listen to the new notifications that have been created by other controllers and pass them to the setNotifications state.
  useEffect(() => {
    const socket = io("http://localhost:3002");

    socket.on("newNotification", (newNotification) => {
      if( ownerId !== newNotification.ownerId){
        return undefined;
      } else {
        setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
        onNewNotification();
        console.log(newNotification)
      }

    });

    //fetch the user's notifications with a GET request to the server.
    const fetchNotifications = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/${ownerId}/notifications`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchNotifications();

    return () => {
      socket.disconnect();
    };
  }, [ownerId, token, onNewNotification]);

  //set the individual notification's isRead boolean value to true 
  const clickNotification = async (id) => {
    const response = await fetch(`http://localhost:3001/notifications/${id}/notification/read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setNotificationRead(data.isRead);
    console.log(data.id); // Here you can log the _id property of the clicked notification
  };

  return (
    <div className="notificationBar" style={{ border: "1px solid", borderColor: medium, background: alt }}>
      <h4>Notifications</h4> 

      {notifications.length === 0 ?
      (
        <p>You don't have any notification</p>
      ):(
        
        <div>
                <p
      className="navigateToNotifications"
      onClick={() => navigate(`/profile/${ownerId}/notifications`)}

    >
      See All
    </p>
        {notifications &&
          notifications
            .slice()
            .reverse()
            .map((notification) => (
              <div
                className={`notificationBarList ${notification._id === notificationId ? "selected" : ""} ${
                  notification && notification.isRead ? "isRead" : ""
                }`}
                onClick={() => {
                  clickNotification(notification._id);
                  if (notification.notificationType === "Follower") {
                    navigate(`/profile/${notification.userId}`);
                  } else {
                    navigate(`/post/${notification.postId}`);
                  }
                }}
                key={notification._id}
              >
                <div className="row ">
                  <div className="col notifyBarList">
                    <UserImage className="notificationUserImage" userId={notification._id} image={notification.picturePath} />
                    <div className="messageBar">
                      <p style={{ margin: "0.4rem auto" }}>{notification.message}</p>
                    </div>
                  </div>
                </div>
                <hr />
              </div>
            ))}
            </div>
      )}

    </div>
  );
};

export default NotificationBarWidget;
