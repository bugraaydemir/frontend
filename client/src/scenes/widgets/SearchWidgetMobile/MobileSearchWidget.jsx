import { useState } from "react";
import { useSelector } from "react-redux";
import UserImage from "components/UserImage";
import "./style.css";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MobileSearchWidget = ({ searchResultId, picturePath }) => {
  const [searchResults, setSearchResult] = useState([]);
  const [enteredText, setEnteredText] = useState('');
  const [isSearchResults, setIsSearchResults] = useState('');

  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const navigate = useNavigate();

//fetching the users with a GET request to the server
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/users?enteredText=${enteredText}&id=${loggedInUserId}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (!enteredText) {
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
    <div className="mobilesearchWidgetBar">
      <div>
        <div className="mobilesearchWidget">
          <p>Search</p>
          <input
            type="text"
            style={{ color: "inherit" }}
            onClick={() => setIsSearchResults(!isSearchResults)}
            value={enteredText}
            onChange={(e) => setEnteredText(e.target.value)}
          />
          <div className="row" style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ width: "100%", height: "70vh" }}>
              {isSearchResults && searchResults && searchResults.length > 0 ? (
                searchResults.map((searchResult) => (
                  <div className="col mobilesearchWidgetBarList" key={searchResult._id}>
                    <div className="mobileresultImage">
                      <UserImage
                        className="customSizePicture"
                        size="30px"
                        userId={searchResult._id}
                        image={searchResult.picturePath}
                      />
                    </div>
                    <div className="mobilenameResult" style={{ color: "dark" }}>
                      <p
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          navigate(`/profile/${searchResult._id}`);
                        }}
                      >
                        {searchResult.firstName} {searchResult.lastName}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                undefined
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSearchWidget;
