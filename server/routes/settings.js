import express from "express";

import { verifyToken } from "../middleware/auth.js";
import {changeFirstName, changeLastName, changeEmail, changeLocation, changeOccupation,changePassword, blockLikeNotification, activatePrivateProfile, changeProfilePicture} from "../controllers/settings.js"
const router = express.Router();

router.patch("/firstName/:id",verifyToken,changeFirstName);
router.patch("/lastName/:id",verifyToken,changeLastName);
router.patch("/email/:id",verifyToken,changeEmail);
router.patch("/likeNotification/:id",verifyToken,blockLikeNotification);
router.patch("/activatePrivateProfile/:id",verifyToken,activatePrivateProfile);
router.patch("/profilePicture/:id",verifyToken,changeProfilePicture);

router.patch("/location/:id",verifyToken,changeLocation);
router.patch("/occupation/:id",verifyToken,changeOccupation);
router.patch("/password/:id",verifyToken,changePassword);


export default router;