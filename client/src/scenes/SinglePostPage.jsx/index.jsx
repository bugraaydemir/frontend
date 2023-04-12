



import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import SinglePostsWidget from "./SinglePostWidget/SinglePostsWidget";
import { useTheme } from "@emotion/react";
const SinglePostPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id} = useSelector((state) => state.user);
  const theme = useTheme();
  const alt = theme.palette.background.alt;
  
  return (
    <Box
   
    width="100%"
    height="100%">
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
        backgroundColor = {alt}
      >
        <Box marginLeft ={isNonMobileScreens ? "-6.8%": undefined} flexBasis={isNonMobileScreens ? "26%" : undefined}>
          <Navbar ownerId = {_id} />
        
        </Box>
        <Box
          
          mt={isNonMobileScreens ? undefined : "2rem"}
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            gridGap: "1rem",
            width:"100%",

          }}
        >
          <SinglePostsWidget userId ={_id} />
        </Box>

      </Box>
    </Box>
  );
};

export default SinglePostPage;