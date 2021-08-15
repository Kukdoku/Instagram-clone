import React, { useState, useContext, useEffect } from "react";
import "./header.css";
import imagelogo from "../images/photogram.png";
import { Avatar, Button } from "@material-ui/core";
import { Chat, ExitToApp, Explore, PermMedia } from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom";
import firebase from "firebase";

import Usercontext from "../context/user";
import { findActiveUser } from "../services/firebase";
import * as ROUTES from "../constants/routes";

function Header() {
  const history = useHistory();
  const user = useContext(Usercontext);
  const [activeUser, setActiveUser] = useState(null);

  useEffect(() => {
    async function getMyUser() {
      const response = await findActiveUser(user.user.uid);
      setActiveUser(response);
    }

    if (user.user) {
      getMyUser();
    }
  }, []);

  return (
    <div className="header">
      <Link to="/" style={{ textDecoration: "none" }}>
        <div className="header__left">
          <img src={imagelogo} alt="WebsiteLogo🚀" className="header__logo" />
          <h2 className="header__link">KukDoKu</h2>
        </div>
      </Link>

      {user.user ? (
        <div className="header__right__signin">
          {/* universal */}
          <Button>
            <Link to="/universal">
              <Explore style={{ color: "black" }} />
            </Link>
          </Button>
          {/* user Profile */}

          {/* chat PlatForm */}

          <Button>
            <Link to="/chat/home">
              <Chat style={{ color: "black" }} />
            </Link>
          </Button>
          {/* SignOut */}
          <Button
            type="button"
            onClick={() => {
              history.push(ROUTES.HOME);
              firebase.auth().signOut();
              window.location.reload();
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                firebase.auth().signOut();

                
                history.push(ROUTES.HOME);
                window.location.reload();
              }
            }}
          >
            <ExitToApp />
          </Button>
          <Link to={`/profile/${user.user.uid}`}>
            {activeUser ? (
              activeUser[0].profile_photo !== "" ? (
                <Avatar
                  src={activeUser[0].profile_photo}
                  style={{ border: "2px solid red" }}
                />
              ) : (
                <Avatar style={{ border: "2px solid red " }} />
              )
            ) : (
              <Avatar style={{ border: "2px solid red " }} />
            )}
          </Link>
        </div>
      ) : (
        <div className="header__right__signout">
          <Link to="/login" style={{ textDecoration: "none" }}>
            <Button>SignIn</Button>
          </Link>
          <Link to="/SignUp" style={{ textDecoration: "none" }}>
            <Button> SignUp</Button>
          </Link>
        </div>
      )}
    </div>
  );
}

export default Header;
