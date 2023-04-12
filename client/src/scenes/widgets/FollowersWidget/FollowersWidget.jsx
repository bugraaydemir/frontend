import { useEffect } from "react";
import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { IconButton } from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserImage from "components/UserImage";
import "./style.css";
import { useState } from "react";
import { setFollowers, setFriends } from "state";

const FollowersWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const [isLoading, setIsLoading] = useState(true);
  const followers = useSelector((state) => state.user.followers);
  const friends = useSelector((state)=>state.user.friends);

  useEffect(() => {
    const getFollowers = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/users/${userId}/followers`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        dispatch(setFollowers({ followers: data }));
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    getFollowers();
  }, [token, userId, dispatch]);


  const Follower = ({ followerId, name, subtitle, userPicturePath }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const loggedInUserId = useSelector((state) => state.user._id);
    const token = useSelector((state) => state.token);
    const [isFollowing, setisFollowing] = useState("");
    const isFriend = friends.some((friend) => friend._id === followerId);    
    console.log(friends)
    console.log(followers)
    console.log(isFollowing)
    console.log(isFriend)
    const removeFollower = async () => {
      const response = await fetch(
        `http://localhost:3001/users/${loggedInUserId}/followers/${followerId}`,
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
        dispatch(setFollowers({ followers: data }));
      }
      // Update isFriend state with the new value obtained from the server's response
      setisFollowing(data.isFollowing);
    };
    const patchFriend = async () => {
      const response = await fetch(
        `http://localhost:3001/users/${loggedInUserId}/${followerId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
   
      
        dispatch(setFriends({ friends: data }));
        setisFollowing(!isFollowing);

     
    };

    useEffect(() => {
      // Check if the loggedInUserId is friends with the friendId
      const checkFriendship = async () => {
        const response = await fetch(
          `http://localhost:3001/users/${loggedInUserId}/followers/${followerId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        setisFollowing(data.isFollowing);
      };
      checkFriendship();
    }, [followerId, loggedInUserId, token]);
  
    return (
      <div className ="card-container">
        <div className ="card-row">

       
        <div className ="userImageFollower" 
        onClick={() => {
          navigate(`/profile/${followerId}`);
          navigate(0);}}>
          <UserImage image ={userPicturePath} />

          <div className ="userName" style={{display:"flex", flexDirection:"column"}}>
          <p className ="userNavigate" onClick={() => {
            navigate(`/profile/${followerId}`);
            navigate(0);
          }}>{name} </p>
          <div className ="subtitle">
            <p>{subtitle}</p>
          
        </div>

        </div>

        </div>
        <div className="divider info "> </div>
        <div className ="addandRemove button">
        <IconButton onClick={loggedInUserId === userId ? removeFollower : patchFriend}>
        {loggedInUserId !== followerId ? (
           loggedInUserId === userId ? (
            isFollowing ? <PersonRemoveOutlined /> : <PersonAddOutlined />
            ) : (
                isFriend ? <PersonRemoveOutlined /> : <PersonAddOutlined />
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

      <div className ="followerCard">
      <h1>Followers List</h1>
      {followers?.map((follower) => (
  <Follower
    key={follower._id}
    followerId={follower._id}
    name={`${follower.firstName} ${follower.lastName}`}
    subtitle={follower.occupation}
    userPicturePath={follower.picturePath}
    followers ={followers}
  />
))}
      </div>
    </div>
  );
  
};

export default FollowersWidget;
