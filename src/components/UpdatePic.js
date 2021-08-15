import { Button, Input } from "@material-ui/core";
import React, { useState, useContext } from "react";
import Usercontext from "../context/user";
import { db, auth, storage } from "../firebase";
import firebase from "firebase";
import { SettingsPowerRounded } from "@material-ui/icons";

function UpdatePic({ uid, activeUser, setOpen, setShow }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("this profile picture is updated at");
  const user = useContext(Usercontext);
 

  const changePic = (e) => {
    e.preventDefault();

    // console.log("hello i am working");
    const uploadTask = storage.ref(`profilePic/${file.name}`).put(file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      (error) => {
        // console.log(error.message);
        alert(error.message);
      },
      () => {
        storage
          .ref("profilePic")
          .child(file.name)
          .getDownloadURL()
          .then((url) => {
            db.collection("users").doc(activeUser.docId).update({
              profile_photo: url,
              profilePicUpdatedAt:
                firebase.firestore.FieldValue.serverTimestamp(),
            });
            db.collection("photos").add({
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              username: user.user.displayName,
              user_uid: uid,
              fileUrl: url,
              liked: [],
              
            });
            //  setCaption("");
            setFile(null);
            setProgress(0);
            setOpen(false);
            setShow("myPosts");

          });
      }
    );
  };

  const FileHandleChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  return (
    <div className="updatePic">
      {progress ? (
        <progress
          id="file"
          value={progress}
          max="100"
          style={{ width: "100%" }}
        />
      ) : null}
      <form onSubmit={changePic}>
        <input
          type="file"
          onChange={FileHandleChange}
          accept=".png, .jpg, .jpeg, .gif,"
          // value={file}
          style={{ marginTop: "10px", marginBottom: "10px" }}
        />
        <Button type="submit" disabled={!file && !activeUser}>
          upload
        </Button>
      </form>
    </div>
  );
}

export default UpdatePic;
