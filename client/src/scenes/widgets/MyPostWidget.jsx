import {
    EditOutlined,
    DeleteOutlined,
    GifBoxOutlined,
    ImageOutlined,
    MicOutlined,
    MoreHorizOutlined,
  } from "@mui/icons-material";
  import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
    useMediaQuery,
  } from "@mui/material";
  import FlexBetween from "components/FlexBetween";
  import Dropzone from "react-dropzone";
  import UserImage from "components/UserImage";
  import WidgetWrapper from "components/WidgetWrapper";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setPosts } from "state";
  
  const MyPostWidget = ({ picturePath }) => {
    const dispatch = useDispatch();
    const [isImage, setIsImage] = useState(false);
    const [isVideo, setIsVideo] = useState(false);
    const [image, setImage] = useState(null);
    const [video, setVideo] = useState(null);
    const [isAudio, setIsAudio] = useState(false);

    const [audio, setAudio] = useState(null);
    const [post, setPost] = useState("");
    const { palette } = useTheme();
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;

    const handlePost = async () => {
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", post);
    
      if (image) {
        formData.append("picture", image);
        formData.append("picturePath", image.name);
        
        const response = await fetch(`http://localhost:3001/posts/picture`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const posts = await response.json();
        dispatch(setPosts({ posts }));
        setImage(null);
        setPost("");

      } else if (video) {
        formData.append("video", video);
        formData.append("videoPath", video.name);
    
        const response = await fetch(`http://localhost:3001/posts/video`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const posts = await response.json();
        dispatch(setPosts({ posts }));
        setVideo(null);
        setPost("");

      } else if (audio) {
        formData.append("audio", audio);
        formData.append("audioPath", audio.name);
    
        const response = await fetch(`http://localhost:3001/posts/audio`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });
        const posts = await response.json();
        dispatch(setPosts({ posts }));
        setAudio(null);
        setPost("");

      } else {
        const response = await fetch(`http://localhost:3001/posts/text`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ userId: _id, description: post }),
        });
        const posts = await response.json();
        dispatch(setPosts({ posts }));
        setPost("");
      }
    

    };
    
    
  
    return (
      <WidgetWrapper marginTop={isNonMobileScreens ? undefined : "0rem"} sx={{border:"2px solid" ,borderColor:medium}}>
        <FlexBetween  sx={{gap:"1.5rem", width:"100%", flexBasis:"0%"}}>
          <UserImage image={picturePath} />
          <InputBase
            placeholder="What's on your mind..."
            onChange={(e) => setPost(e.target.value)}
            value={post}
            sx={{
              width: "100%",
              backgroundColor:"transparent",
              border:"2px solid",
              borderColor: medium,
              borderRadius: "2rem",
              padding: "1rem 2rem",
            }}
          />
        </FlexBetween>
        {isImage && (
          <Box
            border={`1px solid ${medium}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
          >
          <IconButton
            onClick={() => setIsImage(null)}
              sx={{ width: "15%" }}
              >
                      <DeleteOutlined />
                    </IconButton>

            
            <Dropzone
              acceptedFiles=".jpg,.jpeg,.png"
              multiple={false}
              onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
            >
              {({ getRootProps, getInputProps }) => (
                <FlexBetween>
                  <Box
                    {...getRootProps()}
                    border={`2px dashed ${palette.primary.main}`}
                    p="1rem"
                    width="100%"
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    <input {...getInputProps()} />
                    {!image ? (
                      <p>Add Image Here</p>
                    ) : (
                      <FlexBetween>
                        <Typography>{image.name}</Typography>
                        <EditOutlined />
                      </FlexBetween>
                    )}
                  </Box>
                  {image&&(
                    <IconButton
                      onClick={() => setImage(null)}
                      sx={{ width: "15%" }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  )
                  }
                </FlexBetween>
              )}
            </Dropzone>
          </Box>
        )}
        {isVideo && (
          <Box             
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
          >
                      <IconButton
            onClick={() => setIsVideo(null)}
              sx={{ width: "15%" }}
              >
                      <DeleteOutlined />
                    </IconButton>
            <Dropzone 
            acceptedFiles = ".mp4, .avi, .mov,.wmp11,.mpeg"
            multiple = {false}
            onDrop={(acceptedFiles) => setVideo(acceptedFiles[0])} >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!video ? (
                    <p>Add Video Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{video.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>

                  {video && (
                    <IconButton
                      onClick={() => setVideo(null)}
                      sx={{ width: "15%" }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  )}
                </FlexBetween>
              )}
            </Dropzone>
          </Box>
        )}
          {isAudio && (
          <Box             
          border={`1px solid ${medium}`}
          borderRadius="5px"
          mt="1rem"
          p="1rem"
          >
                      <IconButton
            onClick={() => setIsAudio(null)}
              sx={{ width: "15%" }}
              >
                      <DeleteOutlined />
                    </IconButton>
            <Dropzone 
            acceptedFiles = ".mpa, .avi"
            multiple = {false}
            onDrop={(acceptedFiles) => setAudio(acceptedFiles[0])} >
            {({ getRootProps, getInputProps }) => (
              <FlexBetween>
                <Box
                  {...getRootProps()}
                  border={`2px dashed ${palette.primary.main}`}
                  p="1rem"
                  width="100%"
                  sx={{ "&:hover": { cursor: "pointer" } }}
                >
                  <input {...getInputProps()} />
                  {!audio ? (
                    <p>Add Audio Here</p>
                  ) : (
                    <FlexBetween>
                      <Typography>{audio.name}</Typography>
                      <EditOutlined />
                    </FlexBetween>
                  )}
                </Box>

                  {audio && (
                    <IconButton
                      onClick={() => setAudio(null)}
                      sx={{ width: "15%" }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  )}
                </FlexBetween>
              )}
            </Dropzone>
          </Box>
        )}
        <Divider sx={{ margin: "1.25rem 0" }} />
  
        <FlexBetween>
          <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
            <ImageOutlined sx={{ color: mediumMain }} />
            <Typography
              color={mediumMain}
              sx={{ "&:hover": { cursor: "pointer", color: medium } }}
            >
              Image
            </Typography>
          </FlexBetween>
  
           
              <FlexBetween gap="0.25rem">
                <GifBoxOutlined onClick = {()=> setIsAudio(!isAudio)}
                sx={{ color: mediumMain  }} />
                <Typography color={mediumMain}
                sx={{"&:hover": {cursor :"pointer", color:medium}}} onClick = {()=> setIsVideo(!isVideo)}>Clip</Typography>
              </FlexBetween>

  
              <FlexBetween gap="0.25rem">
                <MicOutlined sx={{ color: mediumMain }} />
                <Typography color={mediumMain} onClick = {()=> setIsAudio(!isAudio)}>Audio</Typography>
              </FlexBetween>
          

  
          <Button
            disabled={!post}
            onClick={handlePost}
            sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
            }}
          >
            POST
          </Button>
        </FlexBetween>
      </WidgetWrapper>
    );
  };
  
  export default MyPostWidget;