import { Avatar } from "@material-ui/core";
import React from "react";
import "./chatHeader.css";

function ChatHeader({ user, activeUser }) {
  return (
    <div className="chatHeader">
      <div className="chatHeader__left">
        <Avatar className="chatHeader__avatar" src={activeUser.profile_photo} />
        <h4
          style={{
            marginLeft: "10px",
            color: "#42c99c",
            textShadow: "2px 2px 1px green",
          }}
        >
          {user.user.displayName}
        </h4>
      </div>
      <div className="chatHeader__right"></div>
    </div>
  );
}

export default ChatHeader;
