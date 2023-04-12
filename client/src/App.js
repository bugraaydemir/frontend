import { BrowserRouter as Router, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilepage";
import FollowersPage from "scenes/FollowerList/Followers";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import FriendsPage from "scenes/FriendList/FriendList";
import UserSettingsPage from "scenes/UserSettingsPage";
import NotificationPage from "scenes/notificationPage/NotificationPage";
import ExplorePage from "scenes/explorePage/explore";
import SinglePostPage from "scenes/SinglePostPage.jsx";
import io from "socket.io-client";
import { useEffect } from "react";
import { useState } from "react";
function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(`https://sociallobbystack.herokuapp.com`);
    setSocket(newSocket);

    return () => newSocket.disconnect();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("Connected to server");
        socket.emit("greeting", { message: "Hello" });
      });

      socket.on("greeting", (data) => {
        console.log(data.message); // logs "Hello"
        socket.emit("message", { message: "World" });
      });
    }
  }, [socket]);

  
  return (
    <div className="app">
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Router basename="https://sociallobbystack.herokuapp.com">
          <Routes>
            <Route path='/login' element={<LoginPage/>} />
            <Route
              path='/home'
              element={<HomePage/>} />
            <Route path='/profile/:id/user-settings' 
            element={isAuth ? <UserSettingsPage/>: <Navigate to ="login" />} />
            <Route path='/profile/:id/notifications' 
            element={isAuth ? <NotificationPage/>: <Navigate to ="login" />} />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/explore"
              element={isAuth ? <ExplorePage /> : <Navigate to="/login" />}
            />            

            <Route path='/profile/:userId/following' 
            element = {isAuth ? <FriendsPage /> : <Navigate to = "/login" />}
            />
            
            <Route path='/post/:postId' 
            element = {isAuth ? <SinglePostPage /> : <Navigate to = "/login" />}
            />
            <Route
              path='/profile/:userId/followers'
              element = {isAuth ? <FollowersPage /> : <Navigate to = "/login" />}


              />  
          </Routes>
          </Router>
        </ThemeProvider>
    </div>
  );
}

export default App;