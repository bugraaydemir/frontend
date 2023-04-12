import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import { DeleteOutlined } from "@mui/icons-material";

const Friend = ({ friendId, name, subtitle, userPicturePath, deletePost, id}) => {
  const navigate = useNavigate();
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const dark = palette.neutral.dark;



  


  return (
    <FlexBetween sx={{display:"flex", flexDirection:"row-reverse"}}>
      {friendId === id ? (
      <IconButton onClick={deletePost}  >
      <DeleteOutlined />
    </IconButton>
      ):(
        <IconButton   >
      </IconButton>
      )}

      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />

        <Box
          onClick={() => {
            navigate(`/profile/${friendId}`);
            navigate(0);
          }}
        >        
          <Typography
            color={dark}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: main,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={dark} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>

      </FlexBetween>

    </FlexBetween>
  );
};

export default Friend;
