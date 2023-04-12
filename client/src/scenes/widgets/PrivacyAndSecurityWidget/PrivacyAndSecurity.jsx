import { IconButton,Box, Typography, } from "@mui/material";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { SaveOutlined } from "@mui/icons-material";
import "./style.css"
import { setBlockedList } from "state";
import FlexBetween from "components/FlexBetween";
import { BASE_URL } from "api";

const PrivacyAndSecurity = () => {
    const loggedInUserId = useSelector((state) => state.user._id);
    const token = useSelector((state)=> state.token);
    const [user, setUser] = useState(null);
    const [privateCheckBox, setPrivateCheckBox] = useState(false)
    const [repassword, setRePassword] = useState("");
    const [password, setPassword] = useState("");
    const [isPassword, setIsPassword] = useState("");
    const [isBlock, setIsBlock] = useState("");
    const [isPrivateProfile, setIsPrivateProfile] = useState("");

    const { userId } = useParams(); // get the userId from the URL parameters
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isBlocked = useSelector((state)=> state.user.isBlocked||[]);
    console.log(isBlocked)
    useEffect(() => {
        const getUser = async () => {
          const response = await fetch(`${BASE_URL}/users/profile/${loggedInUserId}/user-settings/`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
    
          if (loggedInUserId !== userId) {
            navigate(`/profile/${loggedInUserId}/user-settings`);
          } else {
            setUser(data);
            setPrivateCheckBox(data.userSettings.isPrivateProfile)

  
                     }
        };
        getUser();
      }, [userId,loggedInUserId, navigate, token]);

      useEffect(() => {
        const getBlockedList = async () => {
          try {
            const response = await fetch(`${BASE_URL}/users/profile/${loggedInUserId}/blockedlist`, {
              method: "GET",
              headers: { Authorization: `Bearer ${token}` },
            });
      
            if (!response.ok) {
              throw new Error('Failed to fetch blocked list');
            }
      
            const data = await response.json();
            console.log(data)
            dispatch(setBlockedList({ isBlocked: data }));
          } catch (error) {
            console.error(error);
          }
        };
      
        getBlockedList();
      }, [loggedInUserId, dispatch, token]);
      
      

      const changePassword = async () => {
        const response = await fetch(`${BASE_URL}/settings/password/${loggedInUserId}`, {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ password, repassword })
        });
      

      
        const data = await response.json();
        setUser({ ...user, password: data });    };


        const activatePrivateProfile = async() => {
          const response = await fetch(`${BASE_URL}/settings/activatePrivateProfile/${loggedInUserId}`, {
            method: "PATCH",
            headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            body: JSON.stringify({ checkedPrivateBox : privateCheckBox })
          });
        
  
        
          const data = await response.json();
          setUser(data);
          
        }



        const BlockedUser = ({ blockedUserId,userId, name }) => {
          const getBlockedListAgain = async () => {
            try {
              const response = await fetch(`${BASE_URL}/users/profile/${loggedInUserId}/blockedlist`, {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
              });
        
              if (!response.ok) {
                throw new Error('Failed to fetch blocked list');
              }
        
              const data = await response.json();
              dispatch(setBlockedList({ isBlocked: data }));
            } catch (error) {
              console.error(error);
          
            }
          };
          const unBlockUser = async () => {
            const response = await fetch(`${BASE_URL}/users/${loggedInUserId}/${blockedUserId}/blockUser`, {
              method: "PATCH",
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
              body: JSON.stringify({ blockedUserId: blockedUserId, userId: userId })
            });
          
            const data = await response.json();
            setUser(data);
            
            // call getBlockedList after unblocking user is successful
            getBlockedListAgain();
          }
          
          
      
        return (
          <FlexBetween>
            <FlexBetween gap="1rem">
              <Box>
               
                  <Typography


                    sx={{
                      "&:hover": {
                        cursor: "pointer",
                      },
                    }}
                  >
                    <p>{name} </p>
                  </Typography>
               
              </Box>
              <IconButton onClick={unBlockUser}>
                
                <p>UnBlock</p>
              </IconButton>
            </FlexBetween>
          </FlexBetween>
        );
      };

  return(
    <div className="container Sec">
      <div className="row passwordSettings">
        <div className ="col firstCol">
  
        <div className="col Sec" onClick={()=> setIsPassword(!isPassword)}>
        <p>Change Your Password </p>
      </div>
        </div> 
  
  
      <div className ="col secondCol">
  
  
  
        {isPassword &&(
        <div className="isPassword">
        <div className="passwordChange">
        <p>New Password </p>
  
      <label for ="password">
        <input type="text" placeholder="New PassWord"  name="password" value= {password} onChange={(e) => setPassword(e.target.value)}>
  
  
        </input>
  
  
      </label>

      </div>
      <div className="passwordChange">
        <p>Re-Type New Password </p>
  
      <label for ="password">
        <input type="text" placeholder=" Re-Type New PassWord"  name="repassword" value= {repassword}   onChange={(e) => setRePassword(e.target.value)}>
  
  
        </input>
  
  
      </label>

      </div>
      <IconButton onClick={changePassword}>
        <SaveOutlined />
  
        </IconButton>
    </div>
        
        )}
  </div>
  <hr />  
  <div className ="col firstCol">
  
  <div className="col Sec" onClick={()=> setIsPrivateProfile(!isPrivateProfile)}>
  <p>Activate Private Profile </p>
</div>
  </div> 


<div className ="col secondCol">



  {isPrivateProfile &&(
  <div className="isPrivateProfile">
  <div className="activatePrivateProfile">
    <div className="checkBox">

  <p>Private Profile </p>

<label for ="privateProfile">
  <input type="checkbox"  value= {privateCheckBox} onChange={(e) => setPrivateCheckBox(e.target.value)}>


  </input>


</label>



</div>
<IconButton onClick={activatePrivateProfile}>
  <SaveOutlined />

  </IconButton>
</div>

</div>

  )}
</div>
<hr />  
  <div className ="col firstCol">
  
  <div className="col Sec" onClick={()=> setIsBlock(!isBlock)}>
  <p>Blocked Users </p>
</div>
  </div> 


<div className ="col secondCol" style={{flexDirection:"column"}}>
{Array.isArray(isBlocked) && isBlocked.map((blockedUser) => (
    <BlockedUser
    key={blockedUser._id}
    blockedUserId={blockedUser._id}
    userId={loggedInUserId}
    name={`${blockedUser.firstName} ${blockedUser.lastName}`}    
  />
))}


  {isBlock &&(
  <div className="blockedUser">
  <div className="blockedUsersList">
    <div className="list">

  <p>Blocked Users </p>





</div>
<IconButton >
  <SaveOutlined />

  </IconButton>
</div>

</div>

  )}
</div>     
  </div>
  <hr />
 
  
  
  
  </div>
  


  

 
 

   

  
  
  )

}

export default PrivacyAndSecurity