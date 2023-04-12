import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    blockCommentNotifications: {
      type: Boolean,
      default: false,
    },
    blockLikeNotifications: {
      type: Boolean,
      default: false,
    },
    blockFollowerNotifications: {
      type: Boolean,
      default: false,
    },
    blockAllNotifications: {
      type: Boolean,
      default: false,
    },
    isPrivateProfile: {
      type: Boolean,
      default: false,
    }
  }, { _id: false });
const UserSchema = new mongoose.Schema(
    {
        firstName : {
        type: String,
        required:true,
        min:2,
        max:32,
    },
    lastName : {
        type: String,
        required:true,
        min:2,
        max:32,
    },
    email : {
        type: String,
        required:true,
        min:5,
        max:32,
        unique:true
    },
    password : {
        type: String,
        required:true,
        min:5,
        max:32,
    },
    picturePath : {
        type: String,
        default:"",
      
    },
    friends: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
      },
      isBlocked: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
      },
    followers: {
        type:[mongoose.Schema.Types.ObjectId],
        ref:'User',
        default:[]
    },
    userSettings: {
        type: notificationSchema,
        default: {
          blockCommentNotifications: false,
          blockLikeNotifications: false,
          blockFollowerNotifications: false,
          blockAllNotifications: false,
          isPrivateProfile: false,
        }
      },

    occupation:String,
    location:String,
    viewedProfile:Number,
    impressions:Number
    },
    {timestamps : true}
)

const User = mongoose.model("User", UserSchema)
export default User