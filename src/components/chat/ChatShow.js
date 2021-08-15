import { Avatar } from "@material-ui/core";
import React from "react";
import "./chatShow.css";

function ChatShow({ chat, activeUser }) {
  // console.log("chat", activeUser);
  // console.log(chat);
  return chat && activeUser ? (
    // {chat.message_sender_uid === activeUser}
    <div
      className="chatShow"
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {chat.message_sender_uid === activeUser.userId ? <div></div> : null}
      <div>
        <div style={{ display: "flex" }} className="chatShowOk">
          {chat.senderpic !== "" ? (
            <Avatar
              src={chat.senderpic}
              className="senderPic"
              style={
                chat.message_sender_uid === activeUser.userId
                  ? { border: "2px solid green" }
                  : { border: "2px solid red" }
              }
            />
          ) : (
            <Avatar className="senderPic" />
          )}
          <h6
            style={{
              display: "relative",
              marginTop: "10px",
              marginLeft: "5px",
            }}
          >
            {chat.message_sender}
            <span style={{ fontSize: "7px", color: "gray", marginLeft: "5px" }}>
              {" "}
              {chat.timeStamp ? chat.timeStamp.toDate().toDateString() : null}
            </span>
          </h6>
        </div>
        {/* <p>{chat.timeStamp}</p> */}
        <div
          className="chatShow__message"
          style={
            chat.message_sender_uid === activeUser.userId
              ? { backgroundColor: "#ffa680" }
              : { backgroundColor: "#9afcb1" }
          }
        >
          <p style={{ padding: "10px" }}>{chat.message}</p>
        </div>
      </div>
    </div>
  ) : null;
}

export default ChatShow;
