import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import MyPostWidget from "scenes/widgets/MyPostWidget";
import PostsWidget from "scenes/widgets/PostsWidget";
import RecommendationWidget from "scenes/widgets/RecommendationWidget/RecommendationWidget";
import { useTheme } from "@emotion/react";


const HomePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id, picturePath, audioPath, videoPath } = useSelector((state) => state.user);
  const theme = useTheme();
  const alt = theme.palette.background.alt;

  
  return (
    <Box backgroundColor = {alt}>
      <Box
      width="100%"
      padding="1rem 0.6rem"
      display={isNonMobileScreens ? "flex" : "block"}
      gap="0.5rem"
      justifyContent="space-between"
      marginTop="1.1rem"
        
      >
        <Box  flexBasis={isNonMobileScreens ? "15%" : undefined}>
        <Navbar ownerId = {_id} />
        
        </Box>
        <Box sx={{display:"flex", flexDirection:"column", gap:"2rem"}}
         
          mt={isNonMobileScreens ? undefined : "2rem"}
        >
          <MyPostWidget  picturePath={picturePath} videoPath = {videoPath} audioPath ={audioPath} />
          <PostsWidget userId={_id} />
        </Box>

           <Box flexBasis={isNonMobileScreens ? "21%" : undefined}>
            {isNonMobileScreens ? <RecommendationWidget userId = {_id} /> : undefined}
        
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;