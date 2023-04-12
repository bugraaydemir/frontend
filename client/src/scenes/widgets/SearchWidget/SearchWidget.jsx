import { useState } from "react";
import { useSelector } from "react-redux";
import UserImage from "components/UserImage";
import "./style.css";
import { useTheme } from "@emotion/react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "api";

const SearchWidget = () => {
  const [searchResults, setSearchResult] = useState([]);
  const [enteredText, setEnteredText] = useState('');

  const token = useSelector((state) => state.token);
  const theme = useTheme();
  const navigate=useNavigate();
  const main = theme.palette.neutral.main;
  const dark = theme.palette.neutral.dark;
  const loggedInUserId =useSelector((state)=> state.user._id)
  const alt = theme.palette.background.alt;
    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const response = await fetch(
              `${BASE_URL}/users?enteredText=${enteredText}&id=${loggedInUserId}`,{
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
            if (response.ok) {
              const data = await response.json();
              if(!enteredText){
                setSearchResult(null);
              } else {
                setSearchResult(data);

              }
            }
          } catch (error) {
            console.error(error);
          }
        };
      
        fetchUsers();
      }, [token, enteredText, loggedInUserId]);

  return (
    <div className ="searchWidgetBar" style={{borderColor:main,background:alt}}>
        <div className="searchHeader">
        <h5>Search</h5>
        </div>

        <input type="text" style={{color:"inherit"}} value={enteredText} onChange={(e) => setEnteredText(e.target.value)}/>
        <hr/>
      {searchResults &&
        searchResults.map((searchResult) => (
          <div className ="searchWidget" key={searchResult._id}>
 
            <div className="row ">
              <div className="col searchWidgetBarList">
                <div className="resultImage">
                <UserImage className="customSizePicture" size="30px"
                userId={searchResult._id}
                image={searchResult.picturePath}
                />
                </div>
                <div className="nameResult" style={{color:dark}}>
                  <p style={{cursor:"pointer"}}onClick={() => {
          navigate(`/profile/${searchResult._id}`)}}>{searchResult.firstName} {searchResult.lastName}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
    </div>
  );
};

export default SearchWidget;
