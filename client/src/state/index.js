import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  user: null,
  token: null,
  posts: [],
  friends:[],
  followers:[],
  singlepost:{},
  picturePath:"",
  isBlocked:[],
 
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state,action) => {
      state.user = null;
      state.token = null;
      action.payload();
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
      setNotifications: (state, action) => {
        state.notifications = action.payload.notifications
      },

    setFollowers: (state, action) => {
      if (state.user) {
        state.user.followers = action.payload.followers;
      } else {
        console.error("user followers non-existent :(");
      }
    },
    setUser:(state,action) => {
      if (state.user) {
      state.user = action.payload.user
      }else {
        console.error("user  non-existent :(");
      }
    },
    setBlockedList: (state, action) => {
      if (state.user) {
        state.user.isBlocked = action.payload.isBlocked;
      } else {
        console.error("user followers non-existent :(");
      }
    },

    
    
    
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setSinglePost: (state, action) => {
      state.singlepost = action.payload.singlepost;
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.singlepost._id) {
          return action.payload.singlepost;
        }
        return post;
      });
      state.posts = updatedPosts;
    },
    
    
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    setPicturePath: (state, action) => {
      state.picturePath = action.payload.picturePath;
    },
  },
});

export const { setMode,setSinglePost,setPicturePath, setLogin, setLogout, setNotifications,setUser, setFriends,setFollowers, setPosts, setPost,setBlockedList } =
  authSlice.actions;
export default authSlice.reducer;