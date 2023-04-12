import { Box,TextField, Typography,useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FlexBetween from "../FlexBetween";
import UserImage from "../UserImage";
import DeleteIcon from '@mui/icons-material/Delete';
import { setPost, setSinglePost } from "state";
import { useDispatch } from "react-redux";
import {IconButton} from "@mui/material";
import {    ChatBubbleOutlined
} from "@mui/icons-material";
import SendIcon from '@mui/icons-material/Send';
import CommentsComment from "../CommentsCommentComponent/CommentsComment";
import { FavoriteBorderOutlined, FavoriteOutlined } from "@mui/icons-material";
import { useState } from "react";
import "./style.css";
const Comment = ({
  commentId,
  postId,
  userId,
  firstName,
  lastName,
  picturePath,
  comment,
  comments,
  likes,
}) => {


// declare and initialize variables and states
const navigate = useNavigate(); 
const { palette } = useTheme();
const main = palette.neutral.main;
const dispatch = useDispatch(); 
const token = useSelector((state) => state.token);
const loggedInUserId = useSelector((state) => state.user._id); 
const isLiked = Boolean(likes[loggedInUserId]); 

// calculate the number of likes for the comment
const likeCount = Object.keys(likes).length;
const commentCount = Object.keys(comment).length;

// declare and initialize states
const [isComment, setIsComment] = useState(false); // a boolean indicating whether the user is adding a comment or not
const [commenter, setComment] = useState(""); // a string representing the user's comment

  console.log(userId);
  console.log(loggedInUserId)
  //make a PATCH request to server to add a child comment

  const childCommentAdd = async () => {
    const response = await fetch(`http://localhost:3001/posts/${postId}/${commentId}/comments`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: loggedInUserId,
        comment: commenter,
      }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    dispatch(setSinglePost({ singlepost: updatedPost })); 
  };
  //make a DELETE request to server to delete a comment
  const commentDelete = async () => {
    if (!commentId) {
      return;
    }

    if (!userId || !postId) {
      console.log("Error: userId and postId are required");
      return;
    }

    const response = await fetch(
      `http://localhost:3001/posts/${loggedInUserId}/${postId}/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      }
    );

    console.log(response);

    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    dispatch(setSinglePost({ singlepost: updatedPost })); 

    console.log(updatedPost);
  };
  //make PATCH request to server side to like a comment
  const commentLike = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/like/${loggedInUserId}/comment/${userId}/${commentId}/${postId}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      }
    );
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    dispatch(setSinglePost({ singlepost: updatedPost })); 
  };


  return (
    <div style={{display:"flex"}}>
{/* The Box component is used to create a container for the comment */}
    <Box
      sx={{
        p: "0",
        display:"flex",
        flexDirection:"column",
        width:"100%"
      }}
    >
      {/* The IconButton component is used to create a delete button */}
      <Box sx={{ display: "flex", justifyContent: "right" }}>
        {loggedInUserId === userId ?(
        <IconButton onClick={commentDelete}>
        <DeleteIcon />
      </IconButton>
        ) :(
          undefined
        )}

      
      </Box>

      {/* The FlexBetween component is used to create a container that arranges its children with space between them */}
      <FlexBetween>
        {/* This FlexBetween component contains the user's picture, name, and comment */}
        <FlexBetween
          gap="1rem"
          sx={{ display: "flex", alignItems: "start" }}
        >
          {/* The UserImage component is used to display the user's picture */}
          <Box
            onClick={() => {
              navigate(`/profile/${userId}`);
              navigate(0);
            }}
            sx={{
              "&:hover": {
                cursor: "pointer",
              },
            }}
          >
            <UserImage image={picturePath} size="55px" />
          </Box>

          {/* The Box component is used to create a container for the user's name and comment */}
          <Box>
            {/* This Box component contains the user's name */}
            <Box
              color={main}
              variant="h5"
              fontWeight="500"
              onClick={() => {
                navigate(`/profile/${userId}`);
                navigate(0);
              }}
              sx={{
                p: "0 0 1 0rem",

                "&:hover": {
                  color: palette.primaryLight,
                  cursor: "pointer",
                },
              }}
            >
              <p className="nameParentComment">{firstName} {lastName} </p>
            </Box>

            {/* This Box component contains the comment */}
            <Box
              color={palette.primaryLight}
              fontWeight="400"
              sx={{
                p: "0.5rem 0 0 0 ",
              }}
            >
              <p className="parentComment-text" style={{width:"150px;", overflowWrap:"break-word"}}>{comment} </p>
              
            </Box>

            {/* This FlexBetween component contains the comment like and comment count */}
            <FlexBetween sx={{gap:"1rem",justifyContent:"flex-start"}}
            >
              {/* The IconButton component is used to create a like button */}
              <IconButton onClick={() => setIsComment(!isComment)}>
                <ChatBubbleOutlined />
               

              </IconButton>

              {/* This FlexBetween component contains the like count */}
              <FlexBetween gap="1.3rem" justifyContent="flex-start">
                <IconButton onClick={commentLike} sx={{width:"30px", height:"30px"}}>
                  {isLiked ? (
                    <FavoriteOutlined sx={{ color: main }} />
                  ) : (
                    <FavoriteBorderOutlined />
                    
                  )}
                <Typography>{likeCount}</Typography>
                </IconButton>

              </FlexBetween>
            </FlexBetween>
            <hr/>
            {/* This div contains the comment section */}
            <div className ="commentContainer">
              {/* The isComment state determines whether to display the comment section or not */}
              {isComment && (
                <div className="commentRow" > 
                  {/* The CommentsComment component is used to display the comments */}

                  {/* map the data that has been loaded into the comments state */}
                  {comments && comments.map((comment, i) => (
                    <CommentsComment
                        key={comment._id}
                        commentId={commentId}
                        childCommentId={comment._id}
                        postId={postId}
                        postUserId={comment.postUserId}
                        userId={comment.userId}
                        firstName={comment.firstName}
                        lastName={comment.lastName}
                        picturePath={comment.picturePath}
                        likes = {comment.likes}
                        comment={comment.comment}
                    />
          ))}

            </div>

            )}
            

            </div>       
              </Box>
            </FlexBetween>
        </FlexBetween>
        {isComment && (
            <Box >
              <Box
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
                  helperText={commenter === '' ? 'This field is required' : ' '}
                  onChange={(e) => 
                  setComment(e.target.value)} />

                  <SendIcon onClick={() => childCommentAdd(comment)} >

                  </SendIcon>
              </Box>
            </Box>
                  
                )}
      <hr />
      </Box>
    </div>
  );
};

export default Comment;
