import { IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { SaveOutlined } from "@mui/icons-material";
import "./style.css";
import { BASE_URL } from "api";


const NotificationSettings = () => {
  //Setting the states for user and id of the currently logged in user 
  const [user, setUser] = useState(null);  
  const loggedInUserId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);

  //constructing checkbox states
  const [likeCheckBox, setLikeCheckBox] = useState(false); // state variable for the "Likes" checkbox
  const [commentCheckBox, setCommentCheckBox] = useState(false); // state variable for the "Comment" checkbox
  const [followerCheckBox, setFollowerCheckBox] = useState(false); // state variable for the "Follower" checkbox
  const [allCheckBox, setAllCheckBox] = useState(false); // state variable for the "All" checkbox

  const { id: userId } = useParams(); // get the userId from the URL parameters
  const navigate = useNavigate();

  //Fetching logged in user's information to implement user-settings
  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`${BASE_URL}/users/profile/${loggedInUserId}/user-settings/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
    
      if (loggedInUserId !== userId) {
        navigate(`/profile/${loggedInUserId}/user-settings`);
      } else {
        setUser(data);
        setLikeCheckBox(data.userSettings.blockLikeNotifications);
        setCommentCheckBox(data.userSettings.blockCommentNotifications);
        setFollowerCheckBox(data.userSettings.blockFollowerNotifications);
        setAllCheckBox(data.userSettings.blockAllNotifications);

        // set the checkbox value based on the data from the server
      }
    };
  
    getUser();
  }, [userId, loggedInUserId, navigate, token]);
  
  //PATCH request to the server thus saving the changes
  const blockNotification = async () => {
    const response = await fetch(`${BASE_URL}/settings/likeNotification/${loggedInUserId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ checkedLikesBox: likeCheckBox,
        checkedCommentsBox: commentCheckBox, 
        checkedFollowerBox: followerCheckBox, 
        checkedAllBox: allCheckBox})
    });
  
    const data = await response.json();
    setUser(data); // update the state value of user directly
  };
  return (
    <div className="container notificationSet">
      <div className="row likeOption">
        <div className="col firstCol">
          <div className="col Notify">
            <p>Likes</p>
          </div>
        </div>
        <div className="col secondCol">
          <div className="likeCheckBox">
            <input
              type="checkbox"
              checked={likeCheckBox}
              onChange={(e) => setLikeCheckBox(e.target.checked)}
            />
          </div>
        </div>
      </div>
      <hr />
      <div className="row commentOption">
        <div className="col firstCol">
          <div className="col Notify">
            <p>Comments</p>
          </div>
        </div>
        <div className="col secondCol">
          <div className="commentCheckBox">
            <input
              type="checkbox"
              checked={commentCheckBox}
              onChange={(e) => setCommentCheckBox(e.target.checked)}
            />
          </div>
        </div>
      </div>
      <hr />
      <div className="row followerOption">
        <div className="col firstCol">
          <div className="col Notify">
            <p>Follower</p>
          </div>
        </div>
        <div className="col secondCol">
          <div className="followerCheckBox">
            <input
              type="checkbox"
              checked={followerCheckBox}
              onChange={(e) => setFollowerCheckBox(e.target.checked)}
            />
          </div>
        </div>
      </div>
      <hr />
      <div className="row allOption">
        <div className="col firstCol">
          <div className="col Notify">
            <p>Block All Notifications</p>
          </div>
        </div>
        <div className="col secondCol">
          <div className="allCheckBox">
            <input
              type="checkbox"
              checked={allCheckBox}
              onChange={(e) => setAllCheckBox(e.target.checked)}
            />
          </div>
        </div>
      </div>
      <div className="submitButton">
        <IconButton onClick={blockNotification}>
          Save
          <SaveOutlined />
        </IconButton>
      </div>
    </div>
  );
  

}

export default NotificationSettings;