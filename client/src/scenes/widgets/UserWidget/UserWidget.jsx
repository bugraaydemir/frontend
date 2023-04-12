import {
    EditOutlined,
  PersonRemoveOutlined,
  PersonAddOutlined,
  BlockOutlined,
  SaveAltOutlined,
  CancelOutlined,
  
} from "@mui/icons-material";

import { useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {  setFriends, setPicturePath } from "state";
import { useDispatch } from "react-redux";
import { IconButton } from "@mui/material";
import { setBlockedList } from "state";

import "./style.css";
import 'bootstrap/dist/css/bootstrap.min.css';
const UserWidget = ({ userId, picturePath, _id, isProfileBlocked }) => {
    // Define state variables
  const [user, setUser] = useState(null);
  const [isFollower, setIsFollower] = useState("");
  const [imageChange, setImageChange] = useState(false);
  const [newPicturePath, setProfilePicture ] = useState("");
  //
  // Define hooks
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const medium = palette.neutral.medium;

  // Get data from Redux store
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const loggedInUserId = useSelector((state)=> state.user._id)

  // Check if the user is a friend of the current user
  const isFriend = friends.some((friend) => friend._id === userId);  console.log(isFriend )

  // Fetch user data from the server
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/${userId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const responseData = await response.text();

        const data = JSON.parse(responseData);
        setUser(data);
        setFriends({friends:data})
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [token, userId]);
  
  useEffect(() => {
    // Check if the loggedInUserId is friends with the friendId
    const checkFriendship = async () => {
      const response = await fetch(
        `http://localhost:3001/users/${loggedInUserId}/friends/${userId}`,
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
  }, [userId, loggedInUserId, token]);
  useEffect(() => {
  }, [user, userId]);

  if (!user) {
    return null;
  }
    // Send a PATCH request to the server to add or remove a friend
  const patchFriend = async () => {
    const response = await fetch(
      `http://localhost:3001/users/${_id}/${userId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();

      // If the current user is viewing their own profile, update the state
      dispatch(setFriends({ friends: data }));
      setIsFollower(!isFollower)

  };
    // Send a PATCH request to the server to block a user
  const blockUser = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${loggedInUserId}/${userId}/blockUser`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const updatedUser = await response.json();
        // Update the isBlocked field in the Redux store
        dispatch(setBlockedList({ isBlocked: updatedUser }));
        window.location.reload();
      } else {
        throw new Error("Failed to block user");
      }
 
    } catch (error) {
      console.error(error);
    }
  };
    // Send a PATCH request to the server to change profile picture
  const changeProfilePicture = async () => {
    const filename = newPicturePath.split("\\").pop(); // Split the path and get the last part (the filename)
    const response = await fetch(`http://localhost:3001/settings/profilePicture/${loggedInUserId}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ picturePath: filename })
    });
    
    const data = await response.json();
    console.log(data);
    dispatch(setPicturePath({picturePath: data}));  
    if (response.ok) {
      window.location.reload(); 
    }
  };
  
  return (
    <div className="container profileCard" style={{border: "2px solid", borderColor: medium, width: "100%"}}>
      <div className="cardRow">
        <div className="col-12"style={{display:"flex", flexDirection:"row",gap:"3rem"}}>
          <div className="user-widget">
            
            {/* Edit profile picture button */}
              {loggedInUserId === userId ? (
                <div className="image-change">
                  <IconButton onClick={() => setImageChange(!imageChange)} sx={{position: "absolute"}}>
                    <EditOutlined sx={{color: "white"}} />
                  </IconButton>
                  {imageChange ? (
                    <div className="uploadImage">
                      <CancelOutlined onClick={() => setImageChange(false)} />
                      <input type="file" id="newPicture" value={newPicturePath} onChange={(e) => setProfilePicture(e.target.value)} />
                      <IconButton onClick={changeProfilePicture}>
                        <SaveAltOutlined />
                      </IconButton>
                    </div>
                  ) : (
                    undefined
                  )}
                  <UserImage image={picturePath} className="user-image" />
                </div>
              ) : (
                <UserImage image={picturePath} className="user-image" />
              )}
            </div>
            
            {/* User info */}
            <div className="user-info">
              <p className="user-name" >{user.firstName} {user.lastName}</p>
              <div className="followerAndPost-info">
                {/* Following button */}
                <p className="user-following" style={{display: "ruby", cursor: "pointer",fontSize:"12px"}} onClick={() => {
                  navigate(`/profile/${userId}/following`);
                  navigate(0);
                }}>
                  {user?.friends?.length || 0} Following
                </p>
                {/* Followers button */}
                <p className="user-followers" style={{display: "ruby", cursor: "pointer",fontSize:"12px"}} onClick={() => {
                  navigate(`/profile/${userId}/followers`);
                  navigate(0);
                }}>
                  {user?.followers?.length || 0} Followers
                </p>
              </div>
              <p className="user-occupation" style={{display: "ruby"}}>{user.occupation}</p>
            </div>
            
            {/* Edit profile and friend/block buttons */}
            {userId === loggedInUserId ? (
              <div className="button-edit">
                {/* Edit profile button */}
                <IconButton onClick={() => navigate(`/profile/${loggedInUserId}/user-settings`)}>
                  <EditOutlined />
                </IconButton>
              </div>
            ) : (
              <div>
                <div className="button-add">
                  {/* Add/remove friend button */}
                  <IconButton onClick={patchFriend}>
                    {isFollower && isFriend ? (
                      <PersonRemoveOutlined />
                    ) : (
                      <PersonAddOutlined />
                    )}
                  </IconButton>
                </div>
                <div className="button-block">
                  {/* Block/unblock user button */}
                  <IconButton onClick={blockUser}>
                    {isProfileBlocked ? (
                      <p>Unblock</p>
                    ) : (
                      <p>Block</p>
                    )}
                  </IconButton>
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
  );
  
  };
  
  export default UserWidget;