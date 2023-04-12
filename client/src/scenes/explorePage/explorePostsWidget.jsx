import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import ExplorePostWidget from "scenes/ExplorePostWidget/ExplorePostWidget";
import { useCallback } from 'react';
import { BASE_URL } from "api";
const ExplorePostsWidget = ({ userId}) => {
  const dispatch = useDispatch();

  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);


  const getExplorePosts = useCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/posts/${userId}/explore`, {
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
  
  useEffect(() => {
    getExplorePosts();
  }, [getExplorePosts]);
  
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
          <ExplorePostWidget
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
export default ExplorePostsWidget