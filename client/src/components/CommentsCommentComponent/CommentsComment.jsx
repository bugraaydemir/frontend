import {useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UserImage from "../UserImage";
import DeleteIcon from '@mui/icons-material/Delete';
import { setPost, setSinglePost } from "state";
import { useDispatch } from "react-redux";
import {IconButton} from "@mui/material";
import {  FavoriteBorderOutlined, FavoriteOutlined
} from "@mui/icons-material";

import "./style.css"
const CommentsComment = ({
  childCommentId,
  commentId,
  postId,
  userId,
  firstName,
  lastName,
  picturePath,
  comment,
  likes
}) => {
  
  const navigate = useNavigate();
  const { palette } = useTheme();
  const main = palette.neutral.main;
  
  // set up dispatch and token for API calls
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  
  // get the currently logged in user ID and check if they've liked this comment
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  
  // get the total number of likes for this comment
  const likeCount = Object.keys(likes).length;
  
  // function to delete a child comment
  const commentDelete = async () => {
    const response = await fetch(
      `http://localhost:3001/posts/${userId}/${postId}/childcomment/${commentId}/${childCommentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      }
    );
  
    console.log(commentId);
  
    const updatedPost = await response.json();
  
    // update the post in Redux state
    dispatch(setPost({ post: updatedPost }));
  
    // update the single post view in Redux state
    dispatch(setSinglePost({ singlepost: updatedPost })); 
  };
  
  // function to like a child comment
  const commentCommentLike = async () => {
    const response = await fetch(`http://localhost:3001/posts/like/${loggedInUserId}/comment/${userId}/comments/${childCommentId}/${commentId}/${postId}`,{
      method : "PATCH",
      headers:{
        Authorization: `Bearer ${token}`,
        "Content-Type":"application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
  
    const updatedPost = await response.json();
  
    // update the post in Redux state
    dispatch(setPost({post:updatedPost}))
  
    // update the single post view in Redux state
    dispatch(setSinglePost({ singlepost: updatedPost })); 
  };
  
  return (
    <div className="childComment">
    <div className="row">
      <div className="row-comments" style={{ display:"flex",marginLeft: "-2rem" }}>
        <div className="picture"
          onClick={() => {
            navigate(`/profile/${userId}`);
            navigate(0);
          }}
        >
          <UserImage image={picturePath} size="40px" />
          <div className="col nameAndComment">
            <div>

            
            <p className="name"
              color={main}
              variant="h5"
              fontWeight="500"
              onClick={() => {
                navigate(`/profile/${userId}`);
                navigate(0);
              }}
            >
              {firstName} {lastName}
            </p>
            </div>
            <div>

            
            <p className="comment-text">
              {comment}
            </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col" style={{ display: "flex", flexDirection: "row", gap:"7rem"}}>
        <div className="col like"style={{justifyContent:"flex-start",gap:"1rem"}}>
          <IconButton onClick={commentCommentLike} sx={{width:"30px", height:"30px"}}>
            {isLiked ? (
              <FavoriteOutlined sx={{ color: main }} />
            ) : (
              <FavoriteBorderOutlined />
            )}
            <p className="likeCount">{likeCount}</p>
          </IconButton>
    
          <div className="deleteComment">
            {loggedInUserId === userId ?(
              
          
          <IconButton onClick={commentDelete}>
        <DeleteIcon />
      </IconButton>
        ) :(
          undefined
        )}
        </div>
        </div>

      </div>
    </div>
    <hr />
  </div>
  

           

               

     
     
  );
};

export default CommentsComment;








