import { ChatBubbleOutlineOutlined, FavoriteBorderOutlined, FavoriteOutlined, ShareOutlined } from "@mui/icons-material";
import { Box, Divider, IconButton, TextField, Typography, useTheme } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import Comment from "components/CommentComponent/Comment";
import SendIcon from '@mui/icons-material/Send';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost, setSinglePost } from "state";
import "./style.css";

const PostWidget = ({

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
  // state for comments section and comment input
  const [isComments, setIsComments] = useState(false);
  const [comment, setComment] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);

  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);

  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  // colors for styling
  const { palette } = useTheme();
  const medium = palette.neutral.medium;
  const primary = palette.primary.main;
  const dark = palette.neutral.dark;
  const alt = palette.background.alt;

  // to generate unique comment IDs
  const { v4: uuidv4 } = require('uuid');

  // function to handle PATCH requests for liking a post
  const patchLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    // update the state in Redux store
    dispatch(setPost({ post: updatedPost }));
    dispatch(setSinglePost({ singlepost: updatedPost }));
  };

  // function to handle PATCH requests for adding a comment to a post
  const commentAdd = async (comment) => {
    const commentId = uuidv4();
    const response = await fetch(`http://localhost:3001/posts/${postId}/comments/${commentId}`, {
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
    // update the state in Redux store
    dispatch(setPost({ post: updatedPost }));
    dispatch(setSinglePost({ singlepost: updatedPost }));
  };

  // function to handle DELETE requests for deleting a post
  const deletePost = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/deletePost`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    if (response.ok) {
      setIsDeleted(true);
    }
  };
  

  
  return (
  
    <div className={`${isDeleted ? "postHidden"  : "postContainer"}`}> 
  
    <div className="postCard" style={{border:"2px solid ",backgroundColor:alt,borderColor:medium, padding:"10px", display:"flex", flexDirection:"column"}} >
      <div> 
  
        <div>
  
          <Friend 
            friendId={postUserId}
            name={name}
            subtitle={location}
            id ={loggedInUserId}
            userPicturePath={userPicturePath}
            deletePost = {deletePost}
          />
  
          <div>
  
          </div>
  
        </div>
        
  
      </div> 
      
  
      <div className ="description"style={{color:dark, marginTop:"2rem"}}>
        
  
        <p className ="description-text" >
          {description}
        </p>
  
      </div>
  
      <hr/>
  
      {picturePath && (
        <div className="postImage" style={{ height: "450px",width:"100%", margin:"2rem auto" }}>
          <img
            alt=""
            style={{ borderRadius: "0.75rem", objectFit: "cover", height: "100%", width: "100%" }}
            src={`http://localhost:3001/assets/${picturePath}`}
          />
        </div>
      )}
  
      {videoPath && (
        <div className="postVideo" style={{ height: "450px", width: "100%" }}>
          <video
            style={{ borderRadius: "0.75rem", objectFit: "cover", height: "100%", width: "100%" }}
            src={`http://localhost:3001/assets/${videoPath}`}
            controls
          >
            Sorry, your browser doesn't support embedded videos.
          </video>
        </div>
      )}
  
      {audioPath && ( 
        <div className="postAudio">
          <audio   
            width="100%"
            height="auto"
            alt=""
            style={{ borderRadius: "0.75rem", marginTop: "0.75rem", maxHeight: "100%", maxWidth: "100%",display:"flex", margin:"0 auto" }}
            src={`http://localhost:3001/assets/${audioPath}`}
            controls
          >
            Sorry, your browser doesn't support embedded audio.
          </audio>
        </div>
      )}
    <FlexBetween mt="0.25rem">
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

export default PostWidget;