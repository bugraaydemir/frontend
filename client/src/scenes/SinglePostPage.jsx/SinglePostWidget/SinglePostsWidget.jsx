import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSinglePost} from "state";
import SinglePostWidget from "./SinglePostWidget";
import { useParams } from "react-router-dom";
const SinglePostsWidget = () => {
  const dispatch = useDispatch();
  const { postId } = useParams(); // Extract the postId from the URL
  const singlepost = useSelector((state) => state.singlepost);
  const token = useSelector((state) => state.token);

  //make a GET request to the server to fetch single post
  //useEffect to re-render the component if dependicies change
  useEffect(() => {
    const getSinglePost = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/posts/${postId}/singlePost`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          }
        );
  
        const data = await response.json();
        dispatch(setSinglePost({ singlepost: data }));
      } catch (error) {
        console.error(error);
      }
    };
  
    getSinglePost();
  }, [dispatch, token, postId]);
  


  return (
<>

{singlepost && Object.values(singlepost).length > 0 && (
  <SinglePostWidget
    key={singlepost._id}
    postId={singlepost._id}
    postUserId={singlepost.userId}
    name={`${singlepost.firstName} ${singlepost.lastName}`}
    description={singlepost.description}
    location={singlepost.location}
    picturePath={singlepost.picturePath}
    videoPath={singlepost.videoPath}
    audioPath={singlepost.audioPath}
    userPicturePath={singlepost.userPicturePath}
    likes={singlepost.likes}      
    comments={singlepost.comments}
  />
)}
</>
  );
  
  
};
export default SinglePostsWidget;