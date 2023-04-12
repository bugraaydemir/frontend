import User from "../models/User.js";
import Post from "../models/Post.js";
import bcrypt from "bcrypt";
export const changeFirstName = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const { firstName } = req.body;
  
      user.firstName = firstName;
      await user.save();
  
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  };

  export const changeLastName = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const { lastName } = req.body;
  
      user.lastName = lastName;
      await user.save();
  
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  };

  export const changeEmail = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const { email, reemail } = req.body;

      if(email !==reemail){
        return res.status(404).json({message: "Emails Do Not Match!"})
      }
      user.email = reemail;
      await user.save();
  
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  };

  export const changeLocation = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const { location } = req.body;
  
      user.location = location;
      await user.save();
  
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  };

  export const changeOccupation = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const { occupation } = req.body;
  
      user.occupation = occupation;
      await user.save();
  
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  };


  export const changePassword = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const { password, repassword } = req.body;
  
      if (password !== repassword) {
        return res.status(404).json({ message: "Passwords Do Not Match!" });
      }
  
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(repassword, salt);
  
      user.password = passwordHash;
      const savedUser = await user.save();
  
      res.status(200).json(savedUser);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  };

  export const blockLikeNotification = async (req, res) => {
    try {
      const { id } = req.params;
      const { checkedLikesBox, checkedCommentsBox, checkedFollowerBox, checkedAllBox } = req.body;
  
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }
      const block = user.userSettings;
      if (!block) {
        return res.status(404).json({ message: "Setting is not found!" });
      }
      // Set the blockLikeNotifications property to the value of the checkedLikesBox parameter
      block.blockLikeNotifications = checkedLikesBox;
      // If the blockLikeNotifications property is already set to true and the checkedLikesBox parameter is false,
      // set the property to false instead
      if (block.blockLikeNotifications && !checkedLikesBox) {
        block.blockLikeNotifications = false;
      }
      block.blockCommentNotifications = checkedCommentsBox;

      if (block.blockCommentNotifications && !checkedCommentsBox) {
        block.blockCommentNotifications = false;
      }
      block.blockFollowerNotifications = checkedFollowerBox;

      if (block.blockFollowerNotifications && !checkedFollowerBox) {
        block.blockFollowerNotifications = false;
      }
      block.blockAllNotifications = checkedAllBox;

      if (block.blockAllNotifications && !checkedAllBox) {
        block.blockAllNotifications = false;
      }
      await user.save();
      res.json({ message: "Block notifications updated!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  };
  export const activatePrivateProfile = async (req, res) => {
    try {
      const { id } = req.params;
      const { checkedPrivateBox } = req.body;
  
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found!" });
      }
      const activateSetting = user.userSettings;
      if (!activateSetting) {
        return res.status(404).json({ message: "Setting is not found!" });
      }
      // Set the blockLikeNotifications property to the value of the checkedLikesBox parameter
      activateSetting.isPrivateProfile = checkedPrivateBox;
      if (activateSetting.isPrivateProfile && !checkedPrivateBox) {
        activateSetting.isPrivateProfile = false;

      }
      await user.save();
      res.json({ message: "Block notifications updated!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  };
  export const changeProfilePicture = async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const { picturePath } = req.body;
  
      // Update the user's picturePath
      user.picturePath = picturePath;
      await user.save();
  
      // Find the posts that belong to the user
      const posts = await Post.find({ userId: user._id });      
      if (!posts) {
        return res.status(404).json({ message: "No posts found for the user" });
      }
  
      // Update the userPicturePath field in all matching posts
      for (let post of posts) {
        post.userPicturePath = picturePath;
        await post.save();
      }
  
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server Error" });
    }
  };
  
  
  
  
  
