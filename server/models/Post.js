import mongoose, { mongo } from "mongoose";
const nestedCommentSchema  = mongoose.Schema({
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    picturePath: String,
    comment: {
      type: String,
      required: true,
    },
    likes: {
      type: Map,
      of: Boolean,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  }, { timestamps: true });
const nestedParentCommentSchema = mongoose.Schema({
    userId: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    picturePath: String,
    comment: {
      type: String,
      required: true,
    },
    likes: {
      type: Map,
      of: Boolean,
    },
    comments:[nestedCommentSchema],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  }, { timestamps: true });
  const postSchema = mongoose.Schema(
    {
      userId: {
        type: String,
        required: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      location: String,
      description: String,
      picturePath: String,
      videoPath: String,
      audioPath: String,
  
      userPicturePath: String,
      likes: {
        type: Map,
        of: Boolean,
      },
      comments: [nestedParentCommentSchema],
    },
    { timestamps: true }
  );
  
  const Post = mongoose.model("Post", postSchema);
  export default Post;
  