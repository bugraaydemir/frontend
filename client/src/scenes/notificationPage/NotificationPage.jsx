import { Box } from "@mui/system";
import NotificationWidget from "./NotificationWidget";
import NotificationBarWidget from "./NotificationBarWidget/NotificationBarWidget";

import Navbar from "scenes/navbar";
import { useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import { useMediaQuery } from "@mui/material";
import RecommendationWidget from "scenes/widgets/RecommendationWidget/RecommendationWidget";


const NotificationPage = () => {
  const loggedInUserId = useSelector((state)=> state.user._id)
  const theme = useTheme();
  const alt = theme.palette.background.alt;
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const medium = theme.palette.neutral.medium;
  return (
    <Box backgroundColor = {alt}>
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
        
      >
        <Box marginLeft ={isNonMobileScreens ? "-6.8%": undefined} flexBasis={isNonMobileScreens ? "18%" : undefined}>
        <Navbar ownerId = {loggedInUserId} />
        
        </Box>
        <Box sx={{display:"flex", 
        flexDirection:"column", 
        gap:"2rem",
        border:"2px solid", 
        borderColor:medium,borderRadius:"20px",
        height:"fit-content",
       }}
         
          margin={isNonMobileScreens ? undefined : "2rem auto"}
        >
          <NotificationWidget userId={loggedInUserId} />
        </Box>

           <Box flexBasis={isNonMobileScreens ? "21%" : undefined}>
            {isNonMobileScreens ? <RecommendationWidget userId = {loggedInUserId} /> : undefined}
        
        </Box>
      </Box>
    </Box>
  );
};

export default NotificationPage