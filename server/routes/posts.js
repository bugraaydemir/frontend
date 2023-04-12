import express from "express";
import {
    getFeedPosts, 
    getUserPosts, 
    likePost, 
    AddOrRemoveComment, 
    deleteComment,
    addCommentToComment, 
    getCommentsComment,
    likeComment,
    likeCommentsComment,
    getExplorePosts,
    deletePost,
    deleteChildComment,
    getSinglePost
} from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/*READ*/
router.get("/:userId/relatedPosts",verifyToken,getFeedPosts);
router.get("/:postId/singlePost",verifyToken,getSinglePost);

router.get("/:userId/explore",verifyToken,getExplorePosts);

router.get("/:id/:userId/posts",verifyToken,getUserPosts)
router.patch("/:postId/comments/:commentId", verifyToken, (req, res) => AddOrRemoveComment(req, res, req.app.get('io')));
router.patch("/:postId/:commentId/comments", verifyToken, (req, res) => addCommentToComment(req, res, req.app.get('io')));router.delete("/:postId/deletePost",verifyToken, deletePost)


router.delete("/:id/:postId/comments/:commentId",verifyToken, deleteComment)
router.delete("/:id/:postId/childcomment/:commentId/:childCommentId",verifyToken, deleteChildComment);
/*UPDATE*/
router.patch("/:id/like", verifyToken, (req, res) => likePost(req, res, req.app.get('io')));
router.patch("/like/:id/comment/:userId/:commentId/:postId", verifyToken, (req, res) => likeComment(req, res, req.app.get('io')));
router.patch("/like/:id/comment/:userId/comments/:childCommentId/:commentId/:postId", verifyToken, (req, res) => likeCommentsComment(req, res, req.app.get('io')));

export default router;