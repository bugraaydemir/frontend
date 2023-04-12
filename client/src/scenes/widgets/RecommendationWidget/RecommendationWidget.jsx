import { useEffect } from "react";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { IconButton, useTheme } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import UserImage from "components/UserImage";
import { useState } from "react";
import { BASE_URL } from "api";
import "./style.css"
const RecommendationWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const [recommended, setRecommendedUsers] = useState([]);
  const { palette } = useTheme();
  const theme = useTheme();

  const medium = palette.neutral.medium;
  const dark = theme.palette.neutral.dark;

  useEffect(() => {
    const getRecommendedProfiles = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/${userId}/recommended`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = await response.text();

        const data = JSON.parse(responseData);
        setRecommendedUsers(data);
      } catch (error) {
        console.error(error);
      }
    };

    getRecommendedProfiles();
  }, [token, userId, dispatch]);
  const RecommendedUser = ({ friendId, name, subtitle, userPicturePath }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loggedInUserId = useSelector((state) => state.user._id);
    const token = useSelector((state) => state.token);
 

    const [isFollower, setIsFollower] = useState(true);
  
    const patchFriend = async () => {
      const response = await fetch(
        `${BASE_URL}/users/${loggedInUserId}/${friendId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      // Always update the state of the friends list after a new friend is added
      dispatch(setFriends({ friends: data }));
      // Update isFriend state with the new value obtained from the server's response
      setIsFollower(data.isFollower);
    };
    
    
    useEffect(() => {
      // Check if the loggedInUserId is friends with the friendId
      const checkFriendship = async () => {
        const response = await fetch(
          `${BASE_URL}/users/${loggedInUserId}/friends/${friendId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setIsFollower(data.isFollower);
      };
      checkFriendship();
    }, [friendId, loggedInUserId, token]);
  
    return (
      <div className ="userCard" >
        <div className ="card-row">

       
        <div className ="userImage">
          <UserImage image ={userPicturePath} className="customUserPicture" size="60px"/>

          <div className ="userName"style={{color:dark, cursor:"pointer"}}>
          <p onClick={() => {
          navigate(`/profile/${friendId}`)}}> {name} </p>


        </div>
        <div className ="addandRemove button">
          <IconButton onClick={patchFriend}>
            {isFollower ? (
              <PersonRemoveOutlined />
            ):(
              <PersonAddOutlined />
            )}

          </IconButton>
        </div>
        </div>
        <div className="divider info">
          
        </div>

      </div>
      </div>

           
    );
  };
  return (

    <div className ="recWidgetBar" style={{border:"2px solid", borderColor: medium}}>
      <div className ="recommendedHeader">
      <h5>Recommendations</h5>
      {recommended && recommended.length > 0 ? (
  <div className="recWidget">
    {recommended.map((profile) => (
      <div className="row" key={profile._id}>
        <div className="col searchWidgetBarList">
          <div className="resultImage">
            <RecommendedUser
              friendId={profile._id}
              name={`${profile.firstName} ${profile.lastName}`}
              userPicturePath={profile.picturePath}
            />
          </div>
        </div>
      </div>
    ))}
  </div>
) : (
  <div>There are no recommendations</div>
)}
      </div>
      </div>
  );
  
};

export default RecommendationWidget;
