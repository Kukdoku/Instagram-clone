import { Avatar, Button, Input } from "@material-ui/core";
import { CameraAlt, Create } from "@material-ui/icons";
import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import LikedPost from "../components/LikedPost";
import MyPost from "../components/MyPost";
import UploadPost from "../components/UploadPost";
import Usercontext from "../context/user";

import "./profile.css";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Follower from "../components/Follower";
import Following from "../components/Following";
import UpdatePic from "../components/UpdatePic";
// import { profileUser } from "../services/firebase";
import {
  doesUsernameExist,
  findActiveUser,
  profileUser,
  updateFollowedUserFollowers,
  updateLoggedInUserFollowing,
} from "../services/firebase";
import firebase from "firebase";
import download from "../images/download.png";
// import Skeleton from "react-loading-skeleton";
import Skeleton from "@material-ui/lab/Skeleton";
import { db, auth, storage } from "../firebase";
import FollowButton from "../components/FollowButton";

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: "50%",
    height: "80%",

    backgroundColor: theme.palette.background.paper,
    // border: "2px solid #000",
    borderRadius: "20px",
    // boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 0, 3),
  },
}));

function Profile() {
  const user_uid = window.location.href.split("/profile/")[1];
  // const [changeUserName, setChangeUserName] = useState('')
  const user = useContext(Usercontext);
  const [show, setShow] = useState("myPosts");
  const [captionForm, setcaptionForm] = useState(false);

  const [popup, setPopup] = useState("");

  const classes = useStyles();

  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [profileUser, setProfileUser] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [status, setStatus] = useState("");
  const [myPostNo, setMyPostNo] = useState("counting");

  let comp;

  const handleOpen = (item) => {
    setOpen(true);
    setPopup(item);
  };

  const handleClose = () => {
    setOpen(false);
    setPopup("");
  };

  if (show === "myPosts") {
    comp = <MyPost uid={user_uid} setMyPostNo={setMyPostNo} />;
  } else if (show === "myUpload") {
    comp = (
      <UploadPost
        profile_uid={user_uid}
        user_uid={user.user.uid}
        setShow={setShow}
      />
    );
  } else if (show === "liked") {
    comp = <LikedPost uid={user_uid} />;
  }

  let body;

  if (popup === "follower") {
    body = (
      <div style={modalStyle} className={classes.paper}>
        {profileUser[0] ? (
          <Follower
            uid={user_uid}
            follower={profileUser[0].follower}
            setOpen={setOpen}
          />
        ) : null}
      </div>
    );
  } else if (popup === "following") {
    body = (
      <div style={modalStyle} className={classes.paper}>
        {profileUser[0] ? (
          <Following
            uid={user_uid}
            following={profileUser[0].following}
            setOpen={setOpen}
          />
        ) : null}
      </div>
    );
  } else if (popup === "updatePic") {
    body = (
      <div style={modalStyle} className={classes.paper}>
        {user_uid !== null && activeUser !== null ? (
          <UpdatePic
            uid={user_uid}
            activeUser={activeUser[0]}
            setOpen={setOpen}
            setShow={setShow}
          />
        ) : (
          <Skeleton variant="text" width={30} height={20} />
        )}
      </div>
    );
  }

  useEffect(() => {
    async function getTimelinePhotos() {
      const result = await findActiveUser(user.user.uid);
      setActiveUser(result);

      await firebase
        .firestore()
        .collection("users")
        .where("userId", "==", user_uid)
        .onSnapshot((snapshot) => {
          setProfileUser(
            snapshot.docs.map((doc) => ({
              ...doc.data(),
              docId: doc.id,
            }))
          );
        });
    }
    if (user_uid !== "" && user) {
      getTimelinePhotos();
    }
  }, [user_uid]);

  const HandleFollow = async (isfollow) => {
    if (isfollow) {
      let following = activeUser[0].following;
      var index = following.indexOf(profileUser[0].userId);
      if (index > -1) {
        following.splice(index, 1);
      }
      let follower = profileUser[0].follower;
      var index = follower.indexOf(activeUser[0].userId);
      if (index > -1) {
        follower.splice(index, 1);
      }
      await firebase
        .firestore()
        .collection("users")
        .doc(activeUser[0].docId)
        .update({
          following: following,
        });
      await firebase
        .firestore()
        .collection("users")
        .doc(profileUser[0].docId)
        .update({
          follower: follower,
        });
    } else {
      let following = [...activeUser[0].following, profileUser[0].userId];
      let follower = [...profileUser[0].follower, activeUser[0].userId];
      await firebase
        .firestore()
        .collection("users")
        .doc(activeUser[0].docId)
        .update({
          following: following,
        });
      await firebase
        .firestore()
        .collection("users")
        .doc(profileUser[0].docId)
        .update({
          follower: follower,
        });
    }
    
  };

  const UpdateStatus = (e) => {
    e.preventDefault();
    db.collection("users").doc(activeUser[0].docId).update({
      status: status,
    });
    setcaptionForm(false);
  };
  if (activeUser) {
    // console.log("active", activeUser[0].data);
  }

  return (
    <div className="profile">
      <div className="profile__top">
        <div className="profile__left">
          {profileUser === null ? (
            <Skeleton
              variant="circle"
              width={100}
              height={100}
              className="profile__pic"
            />
          ) : (
            <img
              src={
                !profileUser[0].profile_photo
                  ? `${download}`
                  : profileUser[0].profile_photo
              }
              alt="profilePic"
              className="profile__pic"
            />
          )}
        </div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
        >
          {body}
        </Modal>
        <div className="profile__right">
          <div style={{ display: "flex", alignItems: "center" }}>
            {profileUser ? (
              <h3>{profileUser[0].username}</h3>
            ) : (
              <p>loading..</p>
            )}
            {user && profileUser ? (
              user_uid === user.user.uid ? (
                <CameraAlt
                  style={{
                    marginLeft: "20px",
                    marginRight: "20px",
                    cursor: "pointer",
                  }}
                  onClick={() => handleOpen("updatePic")}
                />
              ) : profileUser[0].follower.includes(user.user.uid) ? (
                <button
                  onClick={() => HandleFollow(true)}
                  className="followButton"
                  style={{ backgroundColor: "#6edb8b" }}
                >
                  Following
                </button>
              ) : (
                <button
                  variant="outlined"
                  className="followButton"
                  onClick={() => HandleFollow(false)}
                  style={{ backgroundColor: "#db51a4" }}
                >
                  Follow
                </button>
              )
            ) : null}

            <Button variant="outlined">
              {" "}
              <Link to={`/chat/${user_uid}`} style={{ textDecoration: "none" }}>
                message
              </Link>
            </Button>
          </div>

          <div className="profile__information">
            <p className="profile__info" onClick={() => setShow("myPosts")}>
              {myPostNo} posts
            </p>
            <p
              className="profile__info"
              style={{ marginLeft: "20px", marginRight: "20px" }}
              onClick={() => handleOpen("follower")}
            >
              {profileUser ? profileUser[0].follower.length : "..."} follower
            </p>
            <p
              className="profile__info"
              onClick={() => handleOpen("following")}
            >
              {" "}
              {profileUser ? profileUser[0].following.length : "..."} following
            </p>
          </div>
          <div className="profile__caption">
            {captionForm && user.user.uid == user_uid ? (
              <form
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "20px",
                }}
                onSubmit={UpdateStatus}
              >
                <b>Status : </b>
                <Input
                  placeholder="set Status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                />
                <Button type="submit" disabled={!status || !activeUser}>
                  Done
                </Button>
                <Button onClick={() => setcaptionForm(false)}>Back</Button>
              </form>
            ) : (
              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "20px",
                }}
              >
                <b>Status : </b>{" "}
                {profileUser ? (
                  profileUser[0].status
                ) : (
                  <Skeleton varient="text" width={50} height={30} />
                )}{" "}
                <span style={{ cursor: "pointer" }}>
                  <Create onClick={() => setcaptionForm(true)} />
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="profile__button">
        <Button onClick={() => setShow("myPosts")}>All Posts</Button>

        <Button
          style={{ marginLeft: "20wh", marginRight: "20wh" }}
          onClick={() => setShow("myUpload")}
        >
          CreatePosts
        </Button>

        <Button onClick={() => setShow("liked")}>liked</Button>
      </div>

      <div className="profile__content">{comp}</div>
      {/* profile icon */}
      {/* profile details */}
      {/* follower button */}
      {/* my all posts, upload post, liked posts  */}
    </div>
  );
}

export default Profile;
