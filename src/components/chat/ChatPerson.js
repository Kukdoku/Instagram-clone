import { Avatar, Container } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import Person from "./Person";

// left bottom

function ChatPerson({ user, activeUser }) {
  return (
    <div
      className="chatPerson"
      style={{ overflow: "scroll", height: "79vh", scroll: "hidden" }}
    >
      {activeUser && user
        ? activeUser.chat_friends.map((friend) => <Person friend={friend} key={friend}/>)
        : null}
    </div>
  );
}
export default ChatPerson;
