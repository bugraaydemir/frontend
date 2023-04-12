import express from "express";
import {
    getUser,
    getUsers,
    getUserFriends,
    addRemoveFriend,
    isFollower,
    getUserFollowers,
    removeFollower,
    isFollowing,
    getUserSettings,
    getUserNotifications,
    blockUser,
    checkedBlockedUser,
    getBlockedUsers,
    getRecommendedUsers

} from "../controllers/users.js";
import {verifyToken} from "../middleware/auth.js"

const router = express.Router();


/* Read */
router.get("/:id",verifyToken,getUser);
router.get("/",verifyToken,getUsers);
router.get("/:id/recommended",verifyToken,getRecommendedUsers);

router.get("/profile/:id/user-settings",verifyToken,getUserSettings);
router.get("/:ownerId/notifications",verifyToken,getUserNotifications);
router.get("/profile/:id/blockedlist",verifyToken,getBlockedUsers);

router.get("/:id/friends",verifyToken,getUserFriends);
router.get("/:id/followers",verifyToken, getUserFollowers)
router.get('/:id/followers/:followerId',verifyToken, isFollowing)
router.get('/:id/friends/:friendId',verifyToken, isFollower)

/*UPDATE*/
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
router.patch("/:id/:userId/blockUser", verifyToken,blockUser);
router.get("/:viewingUserId/:userId/checkIfBlocked", verifyToken, checkedBlockedUser);

router.patch("/:id/followers/:followerId", verifyToken, removeFollower)

export default router;

