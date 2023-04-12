import { IconButton } from "@mui/material";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./style.css";
import { SaveOutlined } from "@mui/icons-material";


const PersonalSettings = () => {
    const loggedInUserId = useSelector((state) => state.user._id);
    const token = useSelector((state)=> state.token);
    const [user, setUser] = useState(true);
    const [isName, setName] = useState("");
    const [isEmail, setChangeEmail] = useState("");

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [reemail, setReEmail] = useState("");
    const [location, setLocation] = useState("");
    const [isLocation, setIsLocation] = useState("");
    const [occupation, setOccupation] = useState("");
    const [isOccupation, setIsOccupation] = useState("");
console.log(user)
    const { id: userId } = useParams(); // get the userId from the URL parameters
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
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
      //PATCH request to the server for firstName update
      const changeFirstName = async () => {
        const response = await fetch(`http://localhost:3001/settings/firstName/${loggedInUserId}`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ firstName })
        });
      
        const data = await response.json();
        dispatch(setUser({ user: data }));
      };
      //PATCH request to the server for lastName update
      const changeLastName = async () => {
        const response = await fetch(`http://localhost:3001/settings/lastName/${loggedInUserId}`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ lastName })
        });
      
        const data = await response.json();
        dispatch(setUser({ user: data }));
      };
      //PATCH request to the server for email update
      const changeEmail = async () => {
        const response = await fetch(`http://localhost:3001/settings/email/${loggedInUserId}`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ email, reemail })
        });
      
        const data = await response.json();
        dispatch(setUser({ user: data }));
      };
      //PATCH request to the server for location update
      const changeLocation = async () => {
        const response = await fetch(`http://localhost:3001/settings/location/${loggedInUserId}`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ location })
        });
      
        const data = await response.json();
        dispatch(setUser({ user: data }));
      };
      //PATCH request to the server for occupation update
      const changeOccupation = async () => {
        const response = await fetch(`http://localhost:3001/settings/occupation/${loggedInUserId}`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ occupation })
        });
      
        const data = await response.json();
        dispatch(setUser({ user: data }));
      };
return(
  <div className="container PS">
    <div className="row NameSettings">
      <div className="col firstCol">
        <div className="col PS" onClick={() => setName(!isName)}>
          <p>Change Your Name</p>
        </div>
      </div>


      <div className="col secondCol">
        {isName && (
          <div className="isName">
            <div className="firstNameChange">
              <p>First Name</p>
              <label htmlFor="firstName">
                <input
                  type="text"
                  placeholder={user.firstName}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <IconButton onClick={changeFirstName}>
                <SaveOutlined />
              </IconButton>
            </div>

            <div className="lastNameChange">
              <p>Last Name</p>
              <label htmlFor="lastName">
                <input
                  type="text"
                  placeholder={user.lastName}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
              <IconButton onClick={changeLastName}>
                <SaveOutlined />
              </IconButton>
            </div>
          </div>
        )}
      </div>
    </div>
    <hr />

    <div className="row EmailSettings">
      <div className="col firstCol">
        <div className="col PS" onClick={() => setChangeEmail(!isEmail)}>
          <p>Change Your Email Address</p>
        </div>
      </div>

      <div className="col secondCol">
        {isEmail && (
          <div className="isEmail">
            <div className="emailChange">
              <p>Email</p>
              <label htmlFor="email">
                <input
                  type="text"
                  placeholder={user.email}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
              <IconButton sx={{ width: "36.5667px", height: "36.5667px" }} />
            </div>
            <div className="emailChange">
              <p>Re-Type Email</p>
              <label htmlFor="reEmail">
                <input
                  type="email"
                  placeholder="Re-Email"
                  value={reemail}
                  onChange={(e) => setReEmail(e.target.value)}
                />
              </label>
              <IconButton onClick={changeEmail}>
                <SaveOutlined />
              </IconButton>
            </div>
          </div>
        )}
      </div>
    </div>
    <hr />
    <div className="row locationSettings">
      <div className="col firstCol">
        <div className="col PS" onClick={() => setIsLocation(!isLocation)}>
          <p>Change Your Location</p>
        </div>
      </div>


      <div className="col secondCol" style={{ justifyContent: "center" }}>
        {isLocation && (
          <div className="isLocation">
            <div className="locationChange">
              <p>Location</p>
              <label htmlFor="location">
                <input
                  type="text"
                  placeholder={user.location}
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </label>
              <IconButton onClick={changeLocation}>
                <SaveOutlined />
              </IconButton>
            </div>
          </div>
        )}
      
    </div>

    <hr />
  </div>
  <div className="row occupationSettings">
    <div className ="col firstCol">
      <div className="col PS" onClick={()=> setIsOccupation(!isOccupation)}>
        <p>Occupation </p>
      </div>
   </div>
   
   <div className ="col secondCol" style={{justifyContent:"center"}}>
    {isOccupation &&(
    <div className="isOccupation">
      <div className="occupationChange">
        <p>Occupation</p>
        <label for ="occupation">
          <input type="text" placeholder={user.occupation} value={location} onChange={(e) => setOccupation(e.target.value)}/>
          </label>
          <IconButton onClick={changeOccupation} >
            <SaveOutlined />
            </IconButton>
      </div>
    </div>
   )}
   </div>
  </div>
</div>
)
};

export default PersonalSettings