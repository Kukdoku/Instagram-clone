import { Avatar, Button, Input, TextField } from "@material-ui/core";
import {
  AspectRatio,
  Comment,
  Favorite,
  FavoriteBorder,
  OpenInNew,
  OpenWith,
} from "@material-ui/icons";
import Skeleton from "@material-ui/lab/Skeleton";
import React, { useState, useEffect, useContext } from "react";
import Usercontext from "../context/user";
import {
  findActiveUser,
  getAllPostComment,
  getAllPosts,
  getIndivisualPost,
  LikedPosts,
  profileUser,
} from "../services/firebase";
import "./post.css";
import firebase from "firebase";
// import { findByLabelText } from "@testing-library/dom";
import InputEmoji from "react-input-emoji";
import { db } from "../firebase";
import { Link } from "react-router-dom";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import PostPopup from "./PostPopup";
import ReactPlayer from "react-player";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

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
    width: "80%",
    height: "90%",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(0, -5, 2),
    backgroundColor: " rgba(255,255,255,0.9)",
  },
}));

const uniqid = require("uniqid");

function Post({ postId, uploaderId }) {
  const localUrl = window.location.href;

  const [post, setPost] = useState(null);
  const [uploader, setUploader] = useState(null);
  const [comment, setComment] = useState("");
  const user = useContext(Usercontext);
  const [thisPostComments, setThisPostComments] = useState([]);

  const classes = useStyles();

  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <PostPopup post={post} postId={postId} />
    </div>
  );

  useEffect(() => {
    async function getMyPost() {
      // console.log(postId);
      const response = await getIndivisualPost(postId);
      const postComments = await getAllPostComment(postId);

      const uploader = await profileUser(uploaderId);
      setUploader(uploader);
      await response.onSnapshot((snapshot) => {
        setPost(snapshot.data());
      });
      await postComments.onSnapshot((snapshot) => {
        setThisPostComments(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });
    }

    if (postId && uploaderId && user) {
      getMyPost();
    }
  }, [postId]);

  const PostComment = async (e) => {
    // e.preventDefault();
    const comments = [
      ...thisPostComments,
      {
        comment: comment,
        commentUser: user.user.username,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        commentUserUid: user.user.uid,
      },
    ];

    await firebase
      .firestore()
      .collection("photos")
      .doc(postId)
      .collection("comments")
      .add({
        comment: comment,
        commentUser: user.user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        commentUserUid: user.user.uid,
      });

    setComment("");
  };
  // console.log(postId, thisPostComments);

  const Liked = async (t) => {
    if (t) {
      const likeditem = post.liked;
      var index = likeditem.indexOf(user.user.uid);
      if (index > -1) {
        likeditem.splice(index, 1);
      }
      await firebase.firestore().collection("photos").doc(postId).update({
        liked: likeditem,
      });
    } else {
      await firebase
        .firestore()
        .collection("photos")
        .doc(postId)
        .update({
          liked: [...post.liked, user.user.uid],
        });
    }
  };

  return (
    <div className="post">
      {post ? (
        <div className="post__all">
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
          >
            {body}
          </Modal>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
            className="post__new"
          >
            <div className="post_header">
              {uploader ? (
                uploader[0].profile_photo ? (
                  <Avatar
                    className="post_avatar"
                    alt="Vishesh Kumar"
                    src={uploader[0].profile_photo}
                  />
                ) : (
                  <Avatar className="post_avatar" />
                )
              ) : (
                <Avatar className="post_avatar" />
              )}
              <div>
                <Link
                  to={`/profile/${post.user_uid}`}
                  style={{ textDecoration: "none" }}
                >
                  <h3 style={{ marginRight: "10px" }}>{post.username}</h3>
                </Link>
                <p style={{ fontSize: "10px" }}>
                  {post.timestamp.toDate().toDateString()}
                </p>
              </div>
            </div>
            <Link style={{ marginRight: "10px" }} to={`/image/${postId}`}>
              <OpenInNew />
            </Link>
          </div>
          <p
            style={{
              marginLeft: "10px",
              marginBottom: "10px",
              fontSize: "13px",
            }}
          >
            {/* <b>Caption : </b> */}
            {post.caption}
            <b>
              {post.caption === "Update my Profile Pic at" ||
              post.caption === "this profile picture is updated at"
                ? ` ${post.timestamp.toDate().toDateString()}`
                : null}
            </b>
          </p>
        </div>
      ) : (
        <div className="post_header">
          <Skeleton
            variant="circle"
            className="post_avatar"
            width={40}
            height={40}
          />

          <Skeleton variant="text" width={50} height={30} />
        </div>
      )}
      {post ? (
        post.type === 'video' ? (
          <ReactPlayer
            url={post.fileUrl}
            controls="true"
            width = "100%"

            // style={{
            //   objectFit:'contain'
            // }}
            className="post_image"
            
          />
        ) : (
          <img className="post_image" src={post.fileUrl} alt="image of" />
        )
      ) : (
        <Skeleton
          className="post_image"
          variant="rect"
          width="100%"
          height="300px"
        />
      )}

      <div className="post_bottom">
        {post && user.user && thisPostComments ? (
          <div
            style={{
              padding: "10px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div>
              <div className="post__icon">
                {post.liked.includes(user.user.uid) ? (
                  <Favorite
                    style={{ cursor: "pointer", color: "red" }}
                    onClick={() => Liked(true)}
                  />
                ) : (
                  <FavoriteBorder
                    style={{ cursor: "pointer" }}
                    onClick={() => Liked(false)}
                  />
                )}

                <Comment
                  style={{
                    marginLeft: "10px",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                  onClick={() => (window.location.href = "#comment")}
                />
                <AspectRatio
                  onClick={handleOpen}
                  style={{ cursor: "pointer" }}
                />
              </div>
              <p style={{ fontSize: "12px", color: "gray" }}>
                {post.liked.length} Likes {thisPostComments.length} Comments
              </p>
            </div>
            <div>
              {/* share functionality */}
              <FacebookShareButton
                url={`${localUrl}image/${postId}`}
                // quote={props.joke.setup + props.joke.punchline}
                hashtag="#StupidProgrammer"
              >
                <FacebookIcon size={25} round={true} />
              </FacebookShareButton>
              <WhatsappShareButton
                url={`${localUrl}image/${postId}`}
                // quote={props.joke.setup + props.joke.punchline}
                hashtag="#StupidProgrammer"
              >
                <WhatsappIcon
                  size={25}
                  round={true}
                  style={{ marginLeft: "5px", marginRight: "5px" }}
                />
              </WhatsappShareButton>
              <LinkedinShareButton
                url={`${localUrl}image/${postId}`}
                // quote={props.joke.setup + props.joke.punchline}
                hashtag="#StupidProgrammer"
              >
                <LinkedinIcon size={25} round={true} />
              </LinkedinShareButton>
            </div>
          </div>
        ) : null}

        {post && thisPostComments ? (
          <div className="post_comments" style={{ marginBottom: "5px" }}>
            {thisPostComments.slice(0, 5).map(({ id, data }) => (
              <p key={id}>
                <strong>
                  <Link
                    to={`/profile/${data.commentUserUid}`}
                    style={{ textDecoration: "none", fontSize: "13px" }}
                  >
                    {data.commentUser}:
                  </Link>{" "}
                </strong>
                <small>{data.comment}</small>
                <span
                  style={{
                    fontSize: "10px",
                    color: "gray",
                    position: "relative",
                    left: "2px",
                  }}
                >
                  {data.timestamp
                    ? data.timestamp.toDate().toDateString()
                    : null}
                </span>
              </p>
            ))}
          </div>
        ) : (
          <Skeleton className="post_comments" />
        )}
        <div
          className="post__comments__form"
          style={{ display: "flex" }}
          id="comment"
        >
          {/* <form style={{ display: "flex" }} onSubmit={PostComment}> */}
          {/* <input type="text" style={{ width: "100%" }} /> */}
          <InputEmoji
            placeholder="React on this image"
            borderRadius={10}
            borderColor="white"
            value={comment}
            onChange={setComment}
            cleanOnEnter
            onEnter={PostComment}
            maxLength={200}
          />
          <Button
            type="submit"
            onClick={PostComment}
            disabled={!postId || !user || comment.trim() === ""}
          >
            Post
          </Button>
          {/* </form> */}
        </div>
      </div>
    </div>
  );
}

export default Post;
