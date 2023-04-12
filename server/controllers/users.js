import User from "../models/User.js";
import Notification from "../models/Notification.js"
/*Read  */

export const getUser = async (req,res) => {
    try {
        const {id} = req.params;
      
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch(err){
        res.status(404).json({message: err.message});
    }
}
export const getUsers = async (req,res) => {
  try {
    const { id } = req.query;
    const { enteredText } = req.query;
    const regex = new RegExp(enteredText, 'i'); // Case-insensitive regex pattern
    
    let users = await User.find({ firstName: regex });
    
    // Exclude the user with the specified id
    if (id) {
      users = users.filter(user => user._id.toString() !== id);
    }
    
    const formattedUsers = users.map(({ _id, firstName, lastName, picturePath }) => {
      return { _id, firstName, lastName, picturePath };
    });
    
    res.json(formattedUsers);  } catch(err){
      res.status(404).json({message: err.message});
  }
}

export const getUserSettings = async (req,res) => {
  try {
      const {id} = req.params;
      const user = await User.findById(id);

  
      res.status(200).json(user);
    } catch (err) {
      res.status(404).json({ message: "You are not authorizated" });
    }
  }

export const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const friends = await Promise.all(
      user.friends.map((friendId) => User.findById(friendId))
    );
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFriends);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
export const getUserFollowers = async (req,res) => {
  try {
    const {id} = req.params;
    const user = await User.findById(id);
    const followers = await Promise.all(
      user.followers.map((followerId)=> User.findById(followerId))
    );
    const formattedFollowers = followers.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedFollowers);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
}

export const getRecommendedUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const occupation = user.occupation;
    const location = user.location;

    const friends = await Promise.all(
      user.friends.map((friendId)=> User.findById(friendId))
    );

    let recommendations = await User.find({
      $and: [
        { _id: { $nin: [...friends, id] } },
        { $or: [
          { occupation: { $ne: occupation } },
          { location: { $ne: location } }
        ] },
        { $or: [
          { _id: { $ne: id } },
          { friends: { $ne: id } },
          { $and: [
            { _id: { $nin: user.friends } },
            { $or: [
              { occupation: { $ne: occupation } },
              { location: { $ne: location } }
            ] }
          ]}
        ]}
      ],
    });

    // If there are no recommendations, query the database for random users
    if (recommendations.length === 0) {
      return res.status(404).json({message:"There are no recommendations"})
    }

    const formattedRecommendations = recommendations.map(
      ({ _id, firstName, lastName, picturePath}) => {
        return { _id, firstName, lastName, picturePath};
      }
    );

    res.status(200).json(formattedRecommendations);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};


/*UPDATE */

export const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId, followerId } = req.params;
    
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    if (user.friends.includes(friendId)) {
      // Remove friendId from user's friends array
      user.friends = user.friends.filter(friend => !friend.equals(friendId));

      // Remove user's ID from friend's follower array
      friend.followers = friend.followers.filter(friend => !friend.equals(id));
    } else {
      // Add friendId to user's friends array
      user.friends.push(friendId);

      // Add user's ID to friend's friends array
      friend.followers.push(id);
    }
 

    // Save changes to both users
    await user.save();
    await friend.save();
    
    const newNotification = new Notification({
      ownerId: friendId,
      notificationType: "Follower",
      userId:user._id,
      sender:user._id,
      postId:id,
      firstName: user.firstName,
      lastName : user.lastName,
      message: user.firstName + " has followed you",
      picturePath : user.picturePath

    });
    await newNotification.save();
  
    // Update friend status on user object
    const friends = await Promise.all(
      user.friends.map((id) => User.findById(id))
    );  
    const formattedFriends = friends.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return {
          _id,
          firstName,
          lastName,
          occupation,
          location,
          picturePath,
          isFriend: friendId.toString() === _id.toString(),
        };
      }
    );

    res.status(200).json(formattedFriends);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeFollower = async (req, res) => {
  const { id, friendId, followerId } = req.params;

  try {
    const user = await User.findById(id);
    const follower = await User.findById(followerId);

    if (!user) {
      return res.status(404).json({ message: "User, friend, or follower not found" });
    }

    if (user.followers.includes(followerId)) {
      user.followers = user.followers.filter((id) => !id.equals(followerId));
      follower.friends = follower.friends.filter((id) => !id.equals(id));

      await user.save();
      await follower.save();

      const followers = await Promise.all(
        user.followers.map((id) => User.findById(id))
      );

      const formattedFollowers = followers.map(
        ({ _id, firstName, lastName, occupation, location, picturePath }) => {
          return {
            _id,
            firstName,
            lastName,
            occupation,
            location,
            picturePath,
            isFollowing: followerId.toString() === _id.toString(),
          };
        }
      );

      return res.status(200).json(formattedFollowers);
    } else {
      return res.status(400).json({ message: "Follower not found in user's followers list" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const isFollower = async (req, res) => {
  try {
    const { id, friendId } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isFollower = user.friends.includes(friendId);

    return res.status(200).json({ isFollower });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const checkedBlockedUser = async (req, res) => {
  try {
    const { viewingUserId, userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const viewingUser  = await User.findById(viewingUserId)
    const isUserBlocked = user.isBlocked.includes(viewingUserId);
    const isBlocked = viewingUser.isBlocked.includes(userId)
    if(isUserBlocked === true ) {
      return res.status(200).json({ isUserBlocked });

    }else if (isBlocked === true) {
      return res.status(200).json({ isBlocked });
    }
    else {
      return res.status(404).json({message: "User is not blocked or blocked you"})
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
export const isFollowing = async(req,res) => {
  try {
    const { id, followerId} = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found"});
    }
    const isFollowing = user.followers.includes(followerId);
    return res.status(200).json({isFollowing});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }

  };
  export const getUserNotifications = async(req,res) => {
    try {
      const { ownerId } = req.params;
      const user = await User.findById(ownerId);
  
      const notifications = await Notification.find({ ownerId });
      if (!notifications) {
        return res.status(404).json({ message :"Notification Not Found" });
      }
  
      const userBlockSettings = user.userSettings;
      if (!userBlockSettings){
        return res.status(404).json({ message :"Blocking Settings Not Found" });
      }
  
      const notificationBlockLike = userBlockSettings.blockLikeNotifications;
      let filteredNotifications = notifications;
  
      if (notificationBlockLike === true) {
        filteredNotifications = filteredNotifications.filter(notification => notification.notificationType !== "Like");
      }
  
      const notificationBlockComment = userBlockSettings.blockCommentNotifications;
      if (notificationBlockComment === true) {
        filteredNotifications = filteredNotifications.filter(notification => notification.notificationType !== "Comment");
      }
      const notificationBlockAll = userBlockSettings.blockAllNotifications;
      if (notificationBlockAll === true) {
        filteredNotifications = false;
      }
      const notificationBlockFollower = userBlockSettings.blockFollowerNotifications;
      if (notificationBlockFollower === true) {
        filteredNotifications = filteredNotifications.filter(notification => notification.notificationType !== "Follower");
      }
  
      return res.status(200).json(filteredNotifications);
    }
    catch(error) {
      console.error(error);
      return res.status(500).json({ message:"Could not get Notifications" });
    }
  }
  

  export const blockUser = async (req, res) => {
    try {
      const { id, userId } = req.params;
  
      const viewingUser = await User.findById(id);
      if (!viewingUser) {
        return res.status(400).json({ message: "Viewing User Not Found" });
      }
      const viewedUser = await User.findById(userId);
      if (!viewedUser) {
        return res.status(400).json({ message: "Viewed User Not Found" });
      }
  
      const isBlocked = viewingUser.isBlocked.includes(viewedUser._id);
  
      if (!isBlocked) {
        viewingUser.isBlocked.push(viewedUser._id);
  
        // Remove viewedUser from viewingUser's friends and followers arrays
        viewingUser.friends.pull(viewedUser._id);
        viewingUser.followers.pull(viewedUser._id);
  
        // Remove viewingUser from viewedUser's friends and followers arrays
        viewedUser.friends.pull(viewingUser._id);
        viewedUser.followers.pull(viewingUser._id);
      } else {
        viewingUser.isBlocked = viewingUser.isBlocked.filter(
          (blockedUserId) => !blockedUserId.equals(viewedUser._id)
        );
      }
  
      await viewingUser.save();
      await viewedUser.save();
  
      return res.status(200).json(viewingUser);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  

export const getBlockedUsers = async (req,res) => {


  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const isBlockedList = await Promise.all(
      user.isBlocked.map((blockedUserId) => User.findById(blockedUserId))
    );
    const formattedBlockedUsers= isBlockedList.map(
      ({ _id, firstName, lastName, occupation, location, picturePath }) => {
        return { _id, firstName, lastName, occupation, location, picturePath };
      }
    );
    res.status(200).json(formattedBlockedUsers);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
