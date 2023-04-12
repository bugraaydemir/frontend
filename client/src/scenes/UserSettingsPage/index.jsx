import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "scenes/navbar";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import PersonalSettings from "scenes/widgets/PersonalSettingsWidget/PersonalSettings";
import PrivacyAndSecurity from "scenes/widgets/PrivacyAndSecurityWidget/PrivacyAndSecurity";
import NotificationSettings from "scenes/widgets/NotificationWidget/NotificationSettings";
import "./style.css";
import { useTheme } from "@emotion/react";
const UserSettingsPage = () => {
    const loggedInUserId = useSelector((state) => state.user._id);
    const token = useSelector((state)=> state.token)
    //state hooks
    const [user, setUser] = useState(null);
    const { id: userId } = useParams(); // get the userId from the URL parameters
    const [isPS, setIsPS] = useState(true);
    const [isSec, setIsSec] = useState(false);
    const [isNotification, setIsNotification] = useState(false);

    //theme and navigate hooks
    const theme = useTheme();
    const alt = theme.palette.background.alt;
    const medium = theme.palette.neutral.medium;
    const navigate = useNavigate();

// fetching the user information with the loggedInUserId
useEffect(() => {
  const getUser = async () => {
    const response = await fetch(`http://localhost:3001/users/profile/${loggedInUserId}/user-settings/${userId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    if (loggedInUserId !== userId) {
      navigate(`/profile/${loggedInUserId}/user-settings`);
    } else {
      setUser(data);
    }
  };

  getUser();
}, [userId,loggedInUserId, navigate, token]);


    
return (
  <div className="settingsPage" style={{ background: alt, width: "100%", height: "100%", padding:"2rem 0.5%" }}> 
    <div className="settingsNavbar" >
      <Navbar />
    </div>
    <div className="row settingOptions" style={{ borderColor: medium }}>
      <div className="col settingsColumn"style={{ borderColor: medium }} >
        <div className="settingsPSBar">
          <p onClick={() => {
            setIsPS(!isPS); 
            setIsNotification(false);
            setIsSec(false);
          }}> 
            Personal Settings
          </p>
        </div>
        <div className="settingsPSBar">
          <p onClick={() => {
            setIsSec(!isSec);
            setIsPS(false);
            setIsNotification(false);
          }}>
            Privacy And Security
          </p>
        </div>
        <div className="settingsPSBar">
          <p onClick={() => {
            setIsNotification(!isNotification);
            setIsPS(false);
            setIsSec(false);
          }}>
            Notification Settings 
          </p> 
        </div>
      </div>
      {isPS && (
        <PersonalSettings />
      )}
      {isSec && (
        <PrivacyAndSecurity _id={loggedInUserId} userId={userId} />
      )}
      {isNotification && (
        <NotificationSettings />
      )}       
    </div>
  </div>
);

      

      
}

export default UserSettingsPage