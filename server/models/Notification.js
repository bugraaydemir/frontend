import mongoose, { mongo } from "mongoose";

const notificationSchema = mongoose.Schema({

  ownerId: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    required: true,
  },
  notificationType : String,
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  picturePath: String,
  message:String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isRead: {
    type: Boolean,
    default: false,
  },

},{ timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
