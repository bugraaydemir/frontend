import { Box, useMediaQuery } from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useTheme } from "@emotion/react";
import Navbar from "scenes/navbar";
import PostsWidget from "scenes/widgets/PostsWidget";
import UserWidget from "scenes/widgets/UserWidget/UserWidget";
import "./style.css";
const ProfilePage = () => {
  // Declare a state variable `user` with initial value of `null`
  const [user, setUser] = useState(null);

  // Get the `userId` parameter from the URL
  const { userId } = useParams();

  // Get the `token` value from the Redux store
  const token = useSelector((state) => state.token);

  // Check if the screen size is non-mobile
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");

  // Get the current user's ID from the Redux store
  const viewingUserId = useSelector(state => state.user._id);

  // Get the current theme from MUI's `useTheme` hook
  const theme = useTheme();

  // Get the `alt` background color from the current theme
  const alt = theme.palette.background.alt;

  // Declare two state variables for checking if the user is blocked
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);

  
  // Send a Fetch request to the server to get user info
  useEffect(() => {
    const getUser = async () => {
      const response = await fetch(`http://localhost:3001/users/${userId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setUser(data);
    };
    getUser();
  }, [token, userId]);
  
  // Send a GET request to the server to check if currently logged in user has blocked userId
  useEffect(() => {
    const checkBlocked = async () => {
      const response = await fetch(`http://localhost:3001/users/${viewingUserId}/${userId}/checkIfBlocked`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      console.log(data)
      
      if (data.isUserBlocked) {
        setIsUserBlocked(true);
      } else if (data.isBlocked) {
        setIsBlocked(true);
      } else {
        setIsUserBlocked(false);
        setIsBlocked(false);
      }
    };
    checkBlocked();
  }, [token, userId, viewingUserId]);

  if (!user) return null;

  return (
    <Box backgroundColor={alt} width="100%" height="100%">
      <Box
        width="100%"
        padding="2rem 0.5%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="3rem"
        justifyContent="center"
        backgroundColor={alt}
      >
        <Box flexBasis={isNonMobileScreens ? "40%" : undefined}>
          <Navbar />
        </Box>
        <Box>
          <UserWidget userId={userId} picturePath={user.picturePath} _id={viewingUserId} isProfileBlocked={isBlocked}/>
          <div className="userFeed">
            {isBlocked ? (
              <Box sx={{margin: "13rem 10rem"}}>
                <h3>You have block this profile</h3>
              </Box>
            ) : isUserBlocked ? (
              <Box sx={{margin: "13rem 10rem"}}>
                <h3>You are not allowed to view this profile</h3>
              </Box>
            ) : (
              <PostsWidget userId={userId} isProfile />
            )}
          </div>  
        </Box>
        <Box flexBasis={isNonMobileScreens ? "42%" : undefined} mt={isNonMobileScreens ? undefined : "2rem"}>
          <Box marginRight={isNonMobileScreens ? "-6%" : undefined} flexBasis={isNonMobileScreens ?  "26%" : undefined}>
          </Box>

        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;