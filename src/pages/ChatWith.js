import React, { useContext, useState, useEffect } from "react";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessage from "../components/chat/ChatMessage";
import ChatMessageHeader from "../components/chat/ChatMessageHeader";
import ChatPerson from "../components/chat/ChatPerson";
import "./chat.css";
import chat from "../images/chat.gif";
import Usercontext from "../context/user";
import { findActiveUser, profileUser } from "../services/firebase";
import firebase from "firebase";
import { Avatar } from "@material-ui/core";
import Person from "../components/chat/Person";

function ChatWith() {
  const user_uid = window.location.href.split("/chat/")[1];
  const user = useContext(Usercontext);
  const [activeUser, setActiveUser] = useState(null);
  const [friendUser, setFriendUser] = useState(null);

  const [chatId, setChatId] = useState(null);

  useEffect(() => {
    async function getAllInformation() {
      let currentUser = await findActiveUser(user.user.uid);
      setActiveUser(currentUser[0]);
      if (user_uid !== "home") {
        let proUser = await profileUser(user_uid);
        setFriendUser(proUser[0]);
      } else {
        setFriendUser(null);
      }
    }

    if (user.user) {
      getAllInformation();
    }
  }, [user_uid]);



  return user && activeUser ? (
    <div className="chat">
      <div className="chat__left">
        <div className="chatHeader">
          <div className="chatHeader__left">
            <Avatar
              className="chatHeader__avatar"
              src={activeUser.profile_photo}
            />
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
        <div
          className="chatPerson"
          style={{ overflow: "scroll", height: "79vh", scroll: "hidden" }}
        >
          {activeUser && user
            ? activeUser.chat_friends.map((friend) => (
                <Person friend={friend} key={friend} />
              ))
            : null}
        </div>
      </div>
      {user_uid === "home"  ? (
        <div className="chat__right">
          <h3 style={{ textAlign: "center", color: "#7a7258" }}>
            {" "}
            You are free to chat🚀😄
          </h3>
          <img src={chat} className="chat_image" />
        </div>
      ) : activeUser && friendUser ? (
        <div className="chat__right">
          <ChatMessageHeader user_uid={user_uid} />
          <ChatMessage
            user_uid={user_uid}
            activeUser={activeUser}
            friendUser={friendUser}
          />
        </div>
      ) : null}
    </div>
  ) : (
    <div>
      <h5 style={{ textAlign: "centers" }}>Login For access this page </h5>
    </div>
  );
}

export default ChatWith;
