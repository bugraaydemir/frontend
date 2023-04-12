import { Box, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import ExplorePostsWidget from "./explorePostsWidget";
import { useTheme } from "@emotion/react";

const ExplorePage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const { _id} = useSelector((state) => state.user);
  const theme = useTheme();
  const alt = theme.palette.background.alt;
  console.log(_id)
  return (
    <Box 
      backgroundColor={alt}
      width="100%"
      height="100%"
    >
      <Box
        width="100%"
        padding="1rem 0.6rem"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
        backgroundColor={alt}
      >
        <Box 
          marginTop={isNonMobileScreens ? "1.1rem": undefined} 
          flexBasis={isNonMobileScreens ? "16%" : undefined}
        >
          {/* Renders the navbar for the current user */}
          <Navbar ownerId={_id} />
        </Box>
        <Box
          mt={isNonMobileScreens ? undefined : "2rem"}
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", 
            width:"100%",
          }}
        >
          {/* Renders the explore posts widget for the current user */}
          <ExplorePostsWidget userId={_id} />
        </Box>
      </Box>
    </Box>
  );
};

export default ExplorePage;
