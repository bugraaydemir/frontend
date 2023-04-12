import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget/PostWidget.jsx";
import { BASE_URL } from "api";

const PostsWidget = ({ userId, isProfile = false }) => {

  // useDispatch: Hook that returns a reference to the dispatch function from the Redux store.
  const dispatch = useDispatch();

  // useSelector: Hook that returns a piece of state from the Redux store.
  const loggedInUserId = useSelector((state) => state.user._id);
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  // useCallback: Hook that memoizes a function to prevent unnecessary re-renders.
  const getPosts = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/posts/${userId}/relatedPosts`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include'
      });
      const data = await response.json();
      dispatch(setPosts({ posts: data }));
    } catch (error) {
      console.error(error);
    }
  }, [dispatch, token, userId]);

  // useCallback: Hook that memoizes a function to prevent unnecessary re-renders.
  const getUserPosts = useCallback(async () => {
    const response = await fetch(
      `${BASE_URL}/posts/${loggedInUserId}/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include'
      }
    );
    
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  }, [dispatch, loggedInUserId, token, userId]);

  // useEffect: Hook that runs a side effect after every render of the component.
  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  }, [getPosts, getUserPosts, isProfile]);

  return (
    <>
 {Array.isArray(posts) && posts.slice().reverse().map(        
  ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          videoPath,
          audioPath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <PostWidget
            key={_id}
            postId={_id}
            postUserId={userId}
            name={`${firstName} ${lastName}`}
            description={description}
            location={location}
            picturePath={picturePath}
            videoPath={videoPath}
            audioPath={audioPath}

            userPicturePath={userPicturePath}
            likes={likes}
            comments={comments}
          />
        )
      )}
    </>
  );
  
};
export default PostsWidget