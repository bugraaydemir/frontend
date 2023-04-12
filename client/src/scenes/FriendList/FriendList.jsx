import React from "react";
import FriendListWidget from "scenes/widgets/FollowingWidget/FriendListWidget";
import { Box } from "@mui/material";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setFriends } from "state";
import { useTheme } from "@emotion/react";

import Navbar from "scenes/navbar";

const FriendsPage = () => {
    const [user, setUser] = useState(null);
    const token = useSelector((state) => state.token);
    const { userId } = useParams(); 
    const theme = useTheme();
    const alt = theme.palette.background.alt;
  
    //Fetching the viewed user's information by making a GET request to the server
  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    setUser(data);
    setFriends(data.friends); // set the friends' data in the state variable
  };

  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!user) return null;

    return (
      <Box backgroundColor={alt}
      width ="100%"
      height="100%">
        <div>
          <Navbar />
            <div style ={{backgroundColor:alt}}> 
              <FriendListWidget userId={userId}  />
            </div>
       </div>
      </Box>
  );
};

export default FriendsPage;
