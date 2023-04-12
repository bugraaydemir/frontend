import { useState } from "react";
import {
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Message,
  DarkMode,
  LightMode,
  Notifications,
  LogoutOutlined,
  PersonOutlined,
  SearchOutlined,
  ExploreOutlined,
} from "@mui/icons-material";
import { BASE_URL } from "api";
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import "./style.css"
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setMode, setLogout } from "state";
import { useNavigate } from "react-router-dom";

import SearchWidget from "scenes/widgets/SearchWidget/SearchWidget";
import NotificationBarWidget from "scenes/notificationPage/NotificationBarWidget/NotificationBarWidget";
import MobileSearchWidget from "scenes/widgets/SearchWidgetMobile/MobileSearchWidget";

const Navbar = ({notificationId}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const isMobileScreens = useMediaQuery("(max-width: 1000px)");
  const loggedInUserId = useSelector((state) => state.user._id);

  //Assign different variables to the same id, preventing misunderstanding with the controllers
  const ownerId = useSelector((state) => state.user._id);
  const token = useSelector((state) => state.token);

  // react hooks to set data to states
  const [isNotification, setIsNotification] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [isSearch, setIsSearch] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  //theme implementation
  const theme = useTheme();
  const alt = theme.palette.background.alt;

  //alternating the classNames to use in different scenarios
  const notificationIconClassName = isNotification || isSearch ? "buttonIconActivated" : "";
  const buttonNavbarClassName = isNotification || isSearch ? "buttonActivatedNavbar" : "";
  const notificationClassName = isNotification ? "buttonNotifyActivatedNotifyBar" : "buttonNotifyBarNotActivated";
  const searchClassName = isSearch ? "searchBarActivated" : "searchBarNotActivated";
  const mobileSearchClassName = isSearch ? "mobilesearchBarActivated" : "mobilesearchBarNotActivated";
  const unreadNotifications = notifications.some(notification => !notification.isRead);
  
//navigating when logout is called
  const navigateToLogin = () => {
    navigate('/login')
  };
  const handleNewNotification = () => {
    setUnreadNotificationsCount(prevCount => prevCount + 1);
  };
  // fetching user notification in real-time 
  useEffect(() => {    
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/users/${ownerId}/notifications`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchNotifications();
  }, [ownerId, token]);
  

  return (
    <div className="Bars">
      <div className={`Navbar ${buttonNavbarClassName}`}>
        <div className="container nav" style={{ backgroundColor: alt }}>
          <div className={`title ${buttonNavbarClassName}`} onClick={() => navigate("/home")}>
            {(isNotification && isNonMobileScreens) || (isSearch && isNonMobileScreens) ? (
              <p>I</p>
            ) : (
              <p>Social Media</p>
            )}
          </div>
          <div className="cardRow" style ={{display:"flex", flexDirection:"column",width:"inherit"}}>
            {isMobileScreens && isSearch ? (
              <div style={{ background: alt }} className={`searchWidget ${mobileSearchClassName}`}>
                <MobileSearchWidget />
              </div>
            ) : undefined}
            <div className={`col buttons ${notificationIconClassName}`}>
              <div className="searchBar">
                <IconButton 
                sx={{ width: isMobileScreens ? "36px" : undefined, 
                height: isMobileScreens ? "36px" : undefined }}
                  onClick={() => {
                    setIsSearch(!isSearch);
                    setIsNotification(false);
                  }}
                >
                  <SearchOutlined sx={{ width: isMobileScreens ? "30px" : undefined,
                   height: isMobileScreens ? "30px" : undefined }} />
                  <p className="text-search"> Search </p>
                </IconButton>
              </div>
              <div className="explore">
                <IconButton onClick={() => navigate(`/explore`)} 
                sx={{ width: isMobileScreens ? "36px" : undefined,
                 height: isMobileScreens ? "36px" : undefined }} >
                  <ExploreOutlined sx={{ width: isMobileScreens ? "30px" :undefined, 
                  height: isMobileScreens ? "30px" : undefined }} />
                  <p className="text-explore"> Explore </p>
                </IconButton>
              </div>
              <div className="darkMode">
                <IconButton onClick={() => dispatch(setMode())}
                sx={{ width: isMobileScreens ? "36px" : undefined, 
                height: isMobileScreens ? "36px" : undefined }}>
                  {theme.palette.mode === "dark" ? (
                    <DarkMode 
                    sx={{ width: isMobileScreens ? "30px" : undefined, height: 
                    isMobileScreens ? "30px" : undefined }} />
                  ) : (
                    <LightMode 
                    sx={{ width: isMobileScreens ? "30px" : undefined, height:
                     isMobileScreens ? "30px" : undefined }} />
                  )}
                  <p className="text-theme"> Theme </p>
                </IconButton>
              </div>
              <div className="message">
                <IconButton sx={{ width: isMobileScreens ? "36px" : undefined, height: isMobileScreens ? "36px" : undefined }} >
                  <Message sx={{ width: isMobileScreens ? "30px" : undefined, height: isMobileScreens ? "30px" : undefined }} />
                  <p className="text-messages">Messages</p>
                </IconButton>
              </div>
              <div className="notifications">
                <IconButton sx={{ p: "0", width: "36px", height: "36px" }} 
                  onClick={() => {
                    if (isNonMobileScreens) {
                      setIsNotification(!isNotification);
                      setIsSearch(false);
                    } else {
                      navigate(`/profile/${loggedInUserId}/notifications`);
                    }
                  }}
                >
                  <div>
                    {unreadNotificationsCount > 0 || unreadNotifications === true ? (
                      <NotificationsActiveIcon
                        sx={{
                          fontSize: "25px",
                          "&:hover": {
                            cursor: "pointer",
                            width: isMobileScreens ? "30px" : undefined,
                            height: isMobileScreens ? "30px" : undefined,
                          },
                        }}
                      />
                    ) : (
                      <Notifications
                        sx={{
                          fontSize: "25px",
                          "&:hover": {
                            cursor: "pointer",
                            width: isMobileScreens ? "30px" : undefined,
                            height: isMobileScreens ? "30px" : undefined,
                          },
                        }}
                      />
                    )}
                  </div>
                  <p className="text-notifications">Notifications </p>
                </IconButton>

             </div>
             <div className ="PersonIcon">
              <IconButton onClick={() => navigate(`/profile/${loggedInUserId}`)} 
              sx={{ width: isMobileScreens ? "36px" : undefined, 
              height: isMobileScreens ? "36px" : undefined }} >              
                <PersonOutlined 
                sx={{ width: isMobileScreens ? "30px" : undefined, 
                height: isMobileScreens ? "30px" : undefined }}/>
                  <p className="text-profile">Profile</p>
              </IconButton>
              

            </div>

            <div className ="LogoutIcon">
              <IconButton onClick={() => dispatch(setLogout(navigateToLogin))} 
              sx={{ width: isMobileScreens ? "36px" : undefined, 
              height: isMobileScreens ? "36px" : undefined }} >
                <LogoutOutlined sx={{ width: isMobileScreens ? "30px" : undefined, 
                height: isMobileScreens ? "30px" : undefined }}/>
                  <p className="text-logout">Logout</p>
              
              </IconButton>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div className={`barWidget ${notificationClassName}`}>
      <NotificationBarWidget key={notificationId} 
      ownerId={loggedInUserId} 
      notificationId={notifications._id} 
      onNewNotification={handleNewNotification} />
    </div>
    {isNonMobileScreens ? <div  className={`searchWidget ${searchClassName}`}>
      <SearchWidget />
      </div> 
      : undefined}
 </div>
          
    );
  };

export default Navbar;