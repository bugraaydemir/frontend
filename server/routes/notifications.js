import express from "express";
import {
    readNotification
} from "../controllers/notifications.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/*READ*/
router.patch("/:id/notification/read",verifyToken,readNotification);

/*UPDATE*/


export default router;