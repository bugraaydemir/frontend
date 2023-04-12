import { useEffect } from "react";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { IconButton, useTheme } from "@mui/material";
import { BASE_URL } from "api";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setFriends } from "state";
import UserImage from "components/UserImage";
import { useState } from "react";
import "./style.css";
const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);

  useEffect(() => {

    const getFriends = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/${userId}/friends`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();


        dispatch(setFriends({ friends:data }));
      } catch (error) {
        console.error(error);
      }
    };
  
      getFriends();
    }, [token, userId, dispatch]);

  const Friend = ({ friendId, name, subtitle, userPicturePath }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loggedInUserId = useSelector((state) => state.user._id);

    const token = useSelector((state) => state.token);
    const { palette } = useTheme();
    const alt = palette.background.alt;
    const isFriend = friends.some((friend) => friend._id === loggedInUserId); 
       
    const [isFollower, setIsFollower] = useState("");
    console.log(friends)

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
   
      if (loggedInUserId === userId) {
        // If the current user is viewing their own profile, update the state
        dispatch(setFriends({ friends: data }));
      }
      // Update isFriend state with the new value obtained from the server's response
      setIsFollower(!isFollower);
    };
    console.log(isFollower
      )
      console.log(isFriend)
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
    
console.log(isFollower)
console.log(isFriend)

    return (
      <div className="card-container" style={{ backgroundColor: alt }}>
        <div className="card-row">
          <div className="userImage">
            <UserImage image={userPicturePath} />
            <div className="userName" style={{ display: "flex", flexDirection: "column" }}>
              <p
                className="userNavigate"
                onClick={() => {
                  navigate(`/profile/${friendId}`);
                  navigate(0);
                }}
              >
                {name}
              </p>
              <div className="subtitle">
                <p>{subtitle}</p>
              </div>
            </div>
          </div>
          <div className="divider info"></div>
          <div className="addandRemove button">
            <IconButton onClick={patchFriend}>
            {loggedInUserId !== friendId ? (
           loggedInUserId === userId ? (
            isFollower ? <PersonRemoveOutlined /> : <PersonAddOutlined />
            ) : (
              isFollower ? <PersonRemoveOutlined /> : <PersonAddOutlined />
                )
                ) :(
                undefined
          ) }
            </IconButton>
          </div>
        </div>
      </div>
    );
    
  };
  return (
    <div>
      <div className ="friendCard">
        <h1>Follow List</h1>
        {friends?.map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
            friends ={friends}
          />
          ))}
    </div>
  </div>
  );
  
};

export default FriendListWidget;
