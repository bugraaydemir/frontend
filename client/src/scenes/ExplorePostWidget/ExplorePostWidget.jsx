import {
    ChatBubbleOutlineOutlined,
    FavoriteBorderOutlined,
    FavoriteOutlined,
    ShareOutlined,
  } from "@mui/icons-material";
  import { Box, Divider, IconButton, TextField, Typography, useTheme } from "@mui/material";
  import FlexBetween from "components/FlexBetween";
  import Friend from "components/Friend";
  import { useState } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setPost } from "state";
  import Comment from "components/CommentComponent/Comment";
  import SendIcon from '@mui/icons-material/Send';
  import { BASE_URL } from "api";
  import "./style.css";
  const ExplorePostWidget = ({

    postId,
    postUserId,
    name,
    description,
    location,
    userPicturePath,
    picturePath,
    videoPath,
    audioPath,
    likes,
    comments,
    
  }) => {  
  
    const [isComments, setIsComments] = useState(false);
    const dispatch = useDispatch();
    const token = useSelector((state) => state.token);
    const loggedInUserId = useSelector((state) => state.user._id);
    const isLiked = Boolean(likes[loggedInUserId]);
    const likeCount = Object.keys(likes).length;
    const [comment, setComment] = useState("");
    const { palette } = useTheme();
    const medium = palette.neutral.medium;
    const dark = palette.neutral.dark;

    const alt = palette.background.alt;
    const primary = palette.primary.main;

    const { v4: uuidv4 } = require('uuid');
    const patchLike = async () => {
      const response = await fetch(`${BASE_URL}/posts/${postId}/like`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
  
    };
  
    const commentAdd = async (comment) => {
      const commentId = uuidv4();
      const response = await fetch(`${BASE_URL}/posts/${postId}/comments/${commentId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: loggedInUserId,
          comment: comment,
        }),
      });
      const updatedPost = await response.json();
      dispatch(setPost({ post: updatedPost }));
    };
    
    
    
  
    
  return (
    <div className="postContainer" style={{padding:"20px", margin:"0 auto" ,backgroundColor:alt}} >
  
    <div className="postCardExplore" style={{width:"100%",border:"2px solid ",borderColor:medium, padding:"10px", display:"flex", flexDirection:"column"}} >
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <div className ="description"style={{color:dark}}>
      <p className ="description-text"  sx={{ mt: "1rem" }}>
        {description}
      </p>
      </div>
      <hr/>
{picturePath && (
  <div style={{ height: "344px", maxHeight: "100%", maxWidth: "100%"}}>
    <div className="postImage" style={{ height: "100%", width: "100%" }}>
      <img
        alt=""
        style={{ borderRadius: "0.75rem", objectFit: "cover", height: "100%", width: "100%" }}
        src={`${BASE_URL}/assets/${picturePath}`}
      />
    </div>
  </div>
)}
  
  {videoPath && (
      <div style={{ height: "344px", maxHeight: "100%", maxWidth: "100%", margin:"0 auto" }}>
    <div className="postVideo" style={{ height: "100%", width: "100%" }}>
      <video
        style={{ borderRadius: "0.75rem", objectFit: "cover", height: "100%", width: "100%" }}
        src={`${BASE_URL}/assets/${videoPath}`}
        controls 
      >
        Sorry, your browser doesn't support embedded videos.
      </video>
    </div>
    </div>
  )}
  
  {audioPath && (
    <div className="postAudio">
      <audio   
        width="100%"
        height="auto"
        alt=""
        style={{ borderRadius: "0.75rem", marginTop: "0.75rem", maxHeight: "100%", maxWidth: "100%",display:"flex", margin:"0 auto" }}
        src={`${BASE_URL}/assets/${audioPath}`}
        controls 
      >
        Sorry, your browser doesn't support embedded audio.
      </audio>
    </div>
  )}
  <div>
    

      <FlexBetween mt="0.25rem" pt="2rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>
  
          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>
  
        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      </div>
      {isComments && (
        <Box mt="0.5rem" padding="0rem">
  {comments && comments.length > 0 ? (
    comments.map((comment, i) => (
      <Comment 
        userId={comment.userId} 
        postId={postId} 
        comment_id={comment.comment_id}
        commentId={comment._id} 
        picturePath={comment.picturePath} 
        firstName={comment.firstName}
        lastName={comment.lastName}
        comment={comment.comment}
        comments ={comment.comments}
        likes = {comment.likes}
        commentsCommentId={comment._id}
  
        key={comment._id || `${comment.userId}-${i}`} 
      /> 
    ))
  ) : (
    <Typography>No comments yet</Typography>
  )}
          <Divider />
        </Box>
      )}
      
  <Box>
  {isComments && (
        <Box >
          <Box onClick={() => {
            }} 
            sx={{
              display:"flex",
              alignItems:"center",
              gap:"2.6%",
  
              "&:hover": {
                         cursor: "pointer",
              }
          }}>
          
        <TextField  placeholder="Make a comment!"
        sx ={{width:"100%"}}
        multiline
        required
        helperText={comment === '' ? 'This field is required' : ' '}
        onChange={(e) => 
        setComment(e.target.value)} />
      <SendIcon onClick={() => commentAdd(comment)} >
      </SendIcon>
      </Box>
        </Box>
        
      )}
  </Box>
    </div>
    </div>
  
  );
          };
  
  export default ExplorePostWidget;