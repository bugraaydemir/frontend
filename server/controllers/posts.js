  import Notification from "../models/Notification.js";
import Post from "../models/Post.js";
  import User from "../models/User.js";
// ES6 import or TypeScript

/* CREATE */
  export const createPost = async (req, res) => {
    try {
      const { userId, description, picturePath, videoPath, audioPath } = req.body;
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const newPost = new Post({
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        description,
        userPicturePath: user.picturePath,
        picturePath,
        videoPath,
        audioPath,
        likes: {},
        comments: [],
      });
  
      await newPost.save();
  
      const posts = await Post.find();
      res.status(201).json(posts);
    } catch (err) {
      res.status(409).json({ message: err.message });
    }
  };
  

  /* READ */
  export const getFeedPosts = async (req, res) => {
    try {
      const { userId } = req.params;
  
      // Find the user with the given ID
      const user = await User.findById(userId);
  
      // Get the IDs of the user's friends
      const friendIds = user.friends.map((friend) => friend._id);
  
      // Find all posts by the user and their friends
      const posts = await Post.find({
        $or: [{ userId: userId }, { userId: { $in: friendIds } }],
      });
      res.status(200).json(posts);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };
  export const getSinglePost = async (req, res) => {
    try {
      const { postId } = req.params;
  
      // Find the user with the given ID
      const post = await Post.findById(postId);

  

      res.status(200).json(post);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };
  export const getUserPosts = async (req, res) => {
    try {
      const { id, userId } = req.params;
      const user = await User.findById(id);
      const viewedUser = await User.findById(userId);
      const post = await Post.find({ userId });
      const profileSettings = viewedUser.userSettings.isPrivateProfile;
      
      if (!user){
        return res.status(404).json({message:"User not found"})
      }
      if (!viewedUser){
        return res.status(404).json({message:"Viewed User not found"})
      }
      const isFriend = viewedUser.followers.includes(id) || viewedUser._id.equals(user._id);

      if (profileSettings === true && !isFriend) {
        return res.status(500).json({ message: "You have no access to this profile's posts" });
      }
      
  
  
      res.status(200).json(post);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };
export const getExplorePosts = async (req, res) => {
  try {
    const { userId: loggedInUserId } = req.params;

    const user = await User.findById(loggedInUserId);

    const blockedUserIds = user.isBlocked.map((blockedUser) => blockedUser._id);

    const posts = await Post.find({ 
      userId: { $nin: [...blockedUserIds, loggedInUserId] } // exclude blocked users and loggedInUser
    });

    res.status(200).json(posts);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

  

  /* UPDATE */
  export const deletePost = async (req, res) => {
    try {
      const { postId } = req.params;
      const post = await Post.findById(postId);
      await post.deleteOne();
      const posts = await Post.find();
      res.status(200).json({ message: 'Post deleted successfully', posts });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };
  export const likePost = async (req, res,io) => {
    try {
      const { id} = req.params;
      const { userId } = req.body;
      const post = await Post.findById(id);
      const isLiked = post.likes.get(userId);
      const viewingUser = await User.findById(userId)
      if (isLiked) {
        post.likes.delete(userId);
      } else {
        post.likes.set(userId, true);
        if(post.userId !== userId){
        const newNotification = new Notification({
          ownerId: post.userId,
          userId:userId,
          notificationType:"Like",
          postId : id,
          sender:userId,
          firstName: viewingUser.firstName,
          lastName : viewingUser.lastName,
          message: viewingUser.firstName + " has liked your post",
          picturePath : viewingUser.picturePath
  
        });
        await newNotification.save();
        
          io.emit('newNotification', newNotification);
        }
     
      }
      

      const updatedPost = await Post.findByIdAndUpdate(
        id,
        { likes: post.likes },
        { new: true }
      );

      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };
  export const likeComment = async (req, res,io) => {
    try {

      const {commentId,postId } = req.params;
      const { userId  } = req.body;
      const viewingUser = await User.findById(userId)

      const post = await Post.findById(postId);
      if (!post) {
        throw new Error("Post not found");
      }
  
      const comment = post.comments.find(comment => comment._id.equals(commentId));     

      if (!comment) {
        throw new Error("Comment not found");
      }
  
      const isLiked = comment.likes.get(userId);
  
      if (isLiked) {
        comment.likes.delete(userId);
      } else {
        comment.likes.set(userId, true);
        if (userId !== comment.userId){
          const newNotification = new Notification({
            ownerId: comment.userId,
            postId : postId,
            userId: viewingUser._id,
            
            notificationType: "Like",
            firstName: viewingUser.firstName,
            lastName : viewingUser.lastName,
            message: viewingUser.firstName + " has liked your comment",
            picturePath : viewingUser.picturePath
    
          });
          await newNotification.save();
          io.emit('newNotification', newNotification);
        }

      }
      const updatedPost = await post.save();
      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };
  export const likeCommentsComment = async (req, res,io) => {
    try {
      const { postId} = req.params;

      const {commentId,childCommentId } = req.params;
      const { userId  } = req.body;
      const viewingUser = await User.findById(userId)

      const post = await Post.findById(postId);
      if (!post) {
        throw new Error("Post not found");
      }
  
      const parentComment = post.comments.find(comment => comment._id.equals(commentId));     

      if (!parentComment) {
        throw new Error("Comment not found");
      }
      
      const childComments = parentComment.comments.find(comment => comment._id.equals(childCommentId));     
      if(!childComments){
        return res.status(404).json({message: "ChildComment is not found"})
      }
      const isLiked = childComments.likes.get(userId);
  
      if (isLiked) {
        childComments.likes.delete(userId);
      } else {
        childComments.likes.set(userId, true);
        if(childComments.userId !== userId){


 
        const newNotification = new Notification({
          ownerId: childComments.userId,
          userId:viewingUser._id,
          notificationType:"Like",
          postId : postId,

          sender:userId,
          firstName: viewingUser.firstName,
          lastName : viewingUser.lastName,
          message: viewingUser.firstName + " has liked your comment",
          picturePath : viewingUser.picturePath
  
        });
        await newNotification.save();
        io.emit('newNotification', newNotification);
      }
      }
      const updatedPost = await post.save();
      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  };

  export const AddOrRemoveComment = async (req, res,io) => {
    try {
      const { comment } = req.body;
      const { postId, commentId } = req.params;
      const { userId } = req.body;
      const viewingUser = await User.findById(userId);
  
      const user = await User.findById(userId);
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      if (comment.trim() === "") {
        return res.status(400).json({ message: "Comment cannot be empty" });
      }
      const newComment = {
        commentId: commentId, // use the commentId value from the request parameters
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        picturePath: user.picturePath,
        comment,
        comments: [],
        likes: {},
      };
  
      post.comments.push(newComment);
      await post.save();
      if (userId !== post.userId){
      const newNotification = new Notification({
        ownerId: post.userId,
        userId: viewingUser._id,
        notificationType: "Comment",
        postId: postId,
        sender: userId,
        firstName: viewingUser.firstName,
        lastName: viewingUser.lastName,
        message: viewingUser.firstName + " has made a comment to your post",
        picturePath: viewingUser.picturePath,
      });
      await newNotification.save();

      io.emit('newNotification', newNotification);
    }
      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  
  export const addCommentToComment = async (req,res,io) => {
    try {
      const { postId,commentId, id} = req.params;
      const { userId,comment} = req.body;
      const viewingUser = await User.findById(userId)
  
      const user = await User.findById(userId);
      const post = await Post.findById(postId);
      console.log(post.comments);
  
      const parentComment = post.comments.find(comment => comment._id.equals(commentId));      
      if (!parentComment) {
        return res.status(404).json({ message: "Parent comment not found" });
      }
      const newComment = {
        userId,
        firstName: user.firstName,
        lastName: user.lastName,
        picturePath: user.picturePath,
        comment,
        
        likes:{},
      };
  
      parentComment.comments.push(newComment); 
      if(userId !== parentComment.userId){

      
      const newNotification = new Notification({
        ownerId: parentComment.userId,
        userId:viewingUser._id,
        notificationType: "Comment",
        postId : parentComment._id,
        sender:userId,
        firstName: viewingUser.firstName,
        lastName : viewingUser.lastName,
        message: viewingUser.firstName + " has commented on your comment",
        picturePath : viewingUser.picturePath
      });
      await newNotification.save();
      io.emit('newNotification', newNotification);
    }
      await post.save();  
      res.status(201).json(post);
  

  
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
  export const getCommentsComment = async (req, res) => {
    try {
      const { postId, commentId,userId } = req.params;
      const user = await User.findById(userId);
      const post = await Post.findById(postId);
      const parentComment = post.comments.find((comment) =>
        comment._id.equals(commentId)
      );
      const childComments = parentComment.comments;
      console.log(userId);
  
      if (!user) {
        return res.status(400).json({ message: "User Not Found" });
      }
      if (!post) {
        return res.status(400).json({ message: "Post Not Found" });
      }
      if (!parentComment) {
        return res.status(404).json({ message: "Comment Not Found" });
      }
      if (!childComments) {
        return res.status(400).json({ message: "childComment not found" });
      }
  
      res.status(200).json(childComments);
    } catch (error) {
      res.status(500).json({ message: "Could not get comment's comments" });
    }
  };

 export const deleteComment = async (req, res) => {
  try {
  
    const { postId, commentId, id } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    // Find the index of the comment to be deleted in the post's comments array
    const commentIndex = post.comments.findIndex((comment) => comment._id.equals(commentId));
    if (commentIndex === -1) {
      return res.status(404).json({ message: "Comment not found!" });
    }

    // Check if the user trying to delete the comment is the one who created it
    if (post.comments[commentIndex].userId !== id) {
      return res.status(401).json({ message: "You are not authorized to delete this comment!" });
    }

    // Remove the comment from the post's comments array
    post.comments.splice(commentIndex, 1);

    await post.save();

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
export const deleteChildComment = async (req, res) => {
  try {
  
    const { postId, commentId, childCommentId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found!" });
    }

    const parentComment = post.comments.find((comment) =>
      comment._id.equals(commentId)
    );

    const childCommentIndex = parentComment.comments.findIndex(comment =>
      comment._id.equals(childCommentId)
    );

    if (childCommentIndex === -1) {
      return res.status(404).json({ message: "Child comment not found!" });
    }

    parentComment.comments.splice(childCommentIndex, 1);

    await post.save();

    res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
