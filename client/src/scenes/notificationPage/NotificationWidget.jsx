import { useState } from "react";
import { useSelector } from "react-redux";
import UserImage from "components/UserImage";
import "./style.css";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";
import { io } from "socket.io-client";

const NotificationWidget = ({ notificationId }) => {
  //local redux states for loading up data.

  const [notifications, setNotifications] = useState([]);
  const [notification, setNotificationRead] = useState(null);
  // selecting user states
  const ownerId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);
  //theme and navigation hook
  const theme = useTheme();
  const medium = theme.palette.neutral.medium;
  const navigate= useNavigate();
  //listen to the new notifications that have been created by other controllers and pass them to the setNotifications state.
  useEffect(() => {
    const socket = io("http://localhost:3002");

    socket.on("newNotification", (newNotification) => {
      if(ownerId !== newNotification.ownerId){
        return undefined;
      } else {
        setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
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
  }, [ownerId, token]);


  //set the individual notification's isRead boolean value to true 
  const clickNotification = async (id) => {
    const response = await fetch(
      `http://localhost:3001/notifications/${id}/notification/read`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    setNotificationRead(data.isRead);
    console.log(data.id); // Here you can log the _id property of the clicked notification
  };

  return (
    <div className ="notificationPage">
      <h4>Notifications</h4>
      {notifications.length === 0 ?
            (
        <p>You don't have any notification</p>
      ):(
        <div>
        {notifications &&
          notifications.slice().reverse().map((notification) => (
             <div
               className={`notificationList ${
                 notification._id === notificationId ? "selected" : ""
               } ${notification && notification.isRead ? "isRead" : ""}`} style={{borderColor:medium}}
               onClick={() => {
                 clickNotification(notification._id);
                 if(notification.notificationType === "Follower"){
                   navigate(`/profile/${notification.userId}`);
                 } else {
                   navigate(`/post/${notification.postId}`);
                 }
               }}
               key={notification._id}
             >
               <div className="row ">
                 <div className="col notifyList">
                   <UserImage
                     userId={notification._id}
                     image={notification.picturePath}
                   />
                   <div className="message">
                     <p>{notification.message}</p>
                   </div>
                 </div>
               </div>
               <hr style={{margin:"-0.5rem 0"}}/>
             </div>
             
           ))}
           </div>
      )}
      
    </div>
  );
};

export default NotificationWidget;
