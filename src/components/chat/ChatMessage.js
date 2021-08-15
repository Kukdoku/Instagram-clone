import { Button, Container } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import InputEmoji from "react-input-emoji";
import "./chatMessage.css";
import firebase from "firebase";
import ChatShow from "./ChatShow";
import { profileUser } from "../../services/firebase";

function ChatMessage({ activeUser, friendUser, user_uid }) {
  const [text, setText] = useState("");
  const [chat, setChat] = useState(null);
  const [isChatFriend, setIsChatFriend] = useState(false);

  useEffect(() => {
    async function getThisUserChat(chatId) {
      // console.log(postId);
      const response = await firebase
        .firestore()
        .collection("chat")
        .doc("allchatCollection")
        .collection(chatId).orderBy('timeStamp','desc')

   

      await response.onSnapshot((snapshot) => {
        setChat(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });
    }

    if (user_uid && activeUser && friendUser) {
      if (activeUser.chat_friends.includes(user_uid)) {
        getThisUserChat(activeUser.chatUrl[user_uid]);
        setIsChatFriend(true);
      }
    }
  }, [user_uid, isChatFriend]);

  async function handleOnEnter() {
    // console.log(text);

    if (isChatFriend) {
      await firebase
        .firestore()
        .collection("chat")
        .doc("allchatCollection")
        .collection(activeUser.chatUrl[user_uid])

        .add({
          message_sender: activeUser.username,
          message: text,
          timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
          message_sender_uid: activeUser.userId,
          senderpic: activeUser.profile_photo,
        });
    } else {
      let chat_id = activeUser.userId + friendUser.userId;
      let messageUrl = activeUser.chatUrl;
      messageUrl[user_uid] = chat_id;

      let messageUrlOne = friendUser.chatUrl;
      messageUrlOne[activeUser.userId] = chat_id;
      await firebase
        .firestore()
        .collection("users")
        .doc(activeUser.docId)
        .update({
          chat_friends: [...activeUser.chat_friends, user_uid],
        });

      await firebase
        .firestore()
        .collection("users")
        .doc(activeUser.docId)
        .update({
          chatUrl: messageUrl,
        });

      await firebase
        .firestore()
        .collection("users")
        .doc(friendUser.docId)
        .update({
          chat_friends: [...friendUser.chat_friends, activeUser.userId],
        });

      await firebase
        .firestore()
        .collection("users")
        .doc(friendUser.docId)
        .update({
          chatUrl: messageUrlOne,
        });

      await firebase
        .firestore()
        .collection("chat")
        .doc("allchatCollection")
        .collection(chat_id)

        .add({
          message_sender: activeUser.username,
          message: text,
          timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
          message_sender_uid: activeUser.userId,
          senderpic: activeUser.profile_photo,
        });
      setIsChatFriend(true);
      window.location.reload();
    }
  }

  
  return activeUser && friendUser ? (
    <div className="chatMessage" style={{overflow:'scroll',height:'70vh'}}>
      {chat
        ? chat.map((chat) => (
            <ChatShow chat={chat.data} key={chat.id} activeUser={activeUser} />
          ))
        : null}

      <div
        className="chatMessageInput"
        style={{
          display: "flex",
          // marginTop: "auto",
          position: "absolute",
          bottom: -5,
          width: "67%",
          objectFit: "contain",
          backgroundColor: "#f5f4f2",
        }}
      >
        <InputEmoji
          value={text}
          onChange={setText}
          cleanOnEnter
          onEnter={handleOnEnter}
          placeholder="Type a message"
        />
        <Button onClick={handleOnEnter} disabled={!text.trim()}>
          {" "}
          Send
        </Button>
      </div>
    </div>
  ) : (
    <h5>Loading</h5>
  );
}

export default ChatMessage;
