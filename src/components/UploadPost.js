import { Button, Input } from "@material-ui/core";
import React, { useState, useContext } from "react";
import upload from "../images/upload.gif";
import "./uploadPost.css";
import { storage, db } from "../firebase";
import firebase from "firebase";
import Usercontext from "../context/user";
import { Route, useHistory } from "react-router-dom";
import * as ROUTES from "../constants/routes";

function UploadPost({ profile_uid, setShow, user_uid }) {
  const history = useHistory();
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState("");
  const user = useContext(Usercontext);

  // console.log(user.user.displayName);

  const UploadPost = (e) => {
    e.preventDefault();
    // console.log(file);
    // console.log(caption);
    let fileType = file.type.split("/")[0];

    console.log(file);
    if (file.size > 10485760) {
      setError("file size must be less then 10 mb");
    } else {
      const uploadTask = storage.ref(`${fileType}/${file.name}`).put(file);

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
            .ref(`${fileType}`)
            .child(file.name)
            .getDownloadURL()
            .then((url) => {
              db.collection("photos").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption: caption,
                username: user.user.displayName,
                user_uid: user_uid,
                fileUrl: url,
                liked: [],
                type: fileType,
              });
              setCaption("");
              setFile(null);
              setProgress(0);
              setShow("myPosts");
              

              // history.push(`/profile/${uid}`);
              // window.location.reload();
            });
        }
      );
    }
  };

  const FileHandleChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };
  return (
    <div className="uploadPost">
      {progress ? (
        <progress
          id="file"
          value={progress}
          max="100"
          style={{ width: "100%" }}
        />
      ) : null}

      <div style={{ display: "flex" }}>
        <img src={upload} alt="profile Picture" style={{ width: "200px" }} />
        {user.user.uid === profile_uid ? (
          <form className="upload__form" onSubmit={UploadPost}>
            <Input
              type="text"
              onChange={(e) => setCaption(e.target.value)}
              value={caption}
              placeholder="Give Caption For Image"
            />
            <input
              type="file"
              onChange={FileHandleChange}
              accept=".png, .jpg, .jpeg, .gif,.mov,.mp4"
              // value={file}
              style={{ marginTop: "10px", marginBottom: "10pxf" }}
            />
            <Button
              type="submit"
              disabled={!file}
              variant="contained"
              style={{ marginTop: "10px", marginBottom: "10px" }}
            >
              Upload Image
            </Button>
            {error ? (
              <p style={{ color: "red", fontSize: "15px" }}>{error}</p>
            ) : null}
          </form>
        ) : (
          <h3>You can not post at this profile</h3>
        )}
      </div>
    </div>
  );
}

export default UploadPost;
