import { Avatar } from "@material-ui/core";
import React, { useState, useEffect, useContext } from "react";
import InputEmoji from "react-input-emoji";

import Usercontext from "../context/user";

import notFound from "../images/notFound.gif";
import loading from "../images/loading.gif";
import {
  findActiveUser,
  getAllPostComment,
  getIndivisualPost,
} from "../services/firebase";
import { Link } from "react-router-dom";
import { Comment, Favorite, FavoriteBorder } from "@material-ui/icons";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import firebase from "firebase";
import ReactPlayer from "react-player";

function IndividualImage() {
  const user = useContext(Usercontext);
  const imageId = window.location.href.split("/image/")[1];
  const [post, setPost] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [thisImageComment, setThisImageComment] = useState([]);
  const [controller, setController] = useState(true);

  const [comment, setComment] = useState("");

  

  useEffect(() => {
    async function getMyPost() {
      const response = await getIndivisualPost(imageId);
      const postComments = await getAllPostComment(imageId);

      await response.onSnapshot((snapshot) => {
        setPost(snapshot.data());
      });
      await postComments.onSnapshot((snapshot) => {
        setThisImageComment(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });
    }
    if (imageId !== "") {
      getMyPost();
    }
  }, [imageId]);

  const Liked = async (t) => {
    if (t) {
      const likeditem = post.liked;
      var index = likeditem.indexOf(user.user.uid);
      if (index > -1) {
        likeditem.splice(index, 1);
      }
      await firebase.firestore().collection("photos").doc(imageId).update({
        liked: likeditem,
      });
    } else {
      await firebase
        .firestore()
        .collection("photos")
        .doc(imageId)
        .update({
          liked: [...post.liked, user.user.uid],
        });
    }
  };

  const PostComment = async (e) => {
    // e.preventDefault();
    const comments = [
      ...thisImageComment,
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
      .doc(imageId)
      .collection("comments")
      .add({
        comment: comment,
        commentUser: user.user.displayName,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        commentUserUid: user.user.uid,
      });

    // setThisImageComment(comments);

    setComment("");
  };

  // console.log(thisImageComment);

  return controller ? (
    post && user ? (
      <div
        style={{ display: "grid", gridTemplateColumns: "60% 40%" }}
        className="individualImage"
      >
        <div
          style={{
            // borderRight: "1px solid gray",
            // backgroundColor: "#343835",
            // margin: "0 10px 0 10px",
          }}
        >
          {post.type === "video" ? (
            <ReactPlayer
              url={post.fileUrl}
              controls="true"
              width="100%"
              height="89vh"
              style={{
                width: "100%",
                height: "89vh",
                objectFit: "contain",
              }}
            />
          ) : (
            <img
              src={post.fileUrl}
              alt="post Image"
              style={{
                width: "100%",
                height: "89vh",
                border: "1px solid black",

                // position: "relative",

                objectFit: "contain",
              }}
            />
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              {/* <Avatar /> */}
              <div style={{ marginLeft: "10px" }}>
                <Link to={`/profile/${post.user_uid}`}>
                  <h5>{post.username}</h5>
                </Link>
                <p style={{ fontSize: "10px", color: "gray" }}>
                  {post.timestamp.toDate().toDateString()}
                </p>
              </div>
            </div>
            <Link
              to={`/profile/${post.user_uid}`}
              style={{ textDecoration: "none" }}
            >
              Profile
            </Link>
          </div>
          <div>
            <p
              style={{
                marginBottom: "10px",
                borderBottom: "1px solid black",
                fontSize: "14px",
                padding: "10px",
              }}
            >
              <b>caption: </b>
              {post.caption}
              <span
                style={{ color: "gray", fontSize: "13px", marginLeft: "6px" }}
              >
                {post.caption === "Update my Profile Pic at"
                  ? post.timestamp.toDate().toDateString()
                  : null}
              </span>
            </p>
          </div>
          <div
            style={{
              margin: "10px 10px 10px 15px",
              overflow: "scroll",
              overflowX: "hidden",
              height: "55vh",
            }}
          >
            {thisImageComment.map(({ data, id }) => (
              <div
                style={{
                  display: "flex",
                  // alignItems: "center",
                  margin: "5px 7px 9px 5px ",
                }}
                key={id}
              >
                <p>
                  <span
                    style={{
                      color: "#610909",
                      fontSize: "15px",
                      fontWeight: "bold",
                      marginRight: "5px",
                    }}
                  >
                    {data ? (
                      <Link
                        to={`/profile/${data.commentUserUid}`}
                        style={{ textDecoration: "none" }}
                      >
                        {data.commentUser}{" "}
                      </Link>
                    ) : null}{" "}
                    :
                  </span>
                  <span style={{ fontSize: "15px", color: "#4a4747" }}>
                    {data ? data.comment : null}{" "}
                  </span>
                  <span style={{ color: "gray", fontSize: "10px" }}>
                    {data
                      ? data.timestamp
                        ? data.timestamp.toDate().toDateString()
                        : null
                      : null}
                  </span>
                </p>
              </div>
            ))}
          </div>

          <div
            style={{
              position: "fixed",
              bottom: "0px",
              width: "40vw",
              backgroundColor: "#b7bdb9",
              borderTop: "2px solid gray",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                margin: "10px 10px 0 10px",
              }}
            >
              <div>
                {post.liked.includes(user.user.uid) ? (
                  <Favorite
                    style={{
                      marginLeft: "10px",
                      marginRight: "10px",
                      color: "red",
                      cursor: "pointer",
                    }}
                    onClick={() => Liked(true)}
                  />
                ) : (
                  <FavoriteBorder
                    style={{
                      marginLeft: "10px",
                      marginRight: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => Liked(false)}
                  />
                )}

                <Comment />
              </div>
              <div>
                <FacebookShareButton
                  url={window.location.href}
                  // quote={props.joke.setup + props.joke.punchline}
                  hashtag="#StupidProgrammer"
                >
                  <FacebookIcon size={25} round={true} />
                </FacebookShareButton>
                <WhatsappShareButton
                  url={window.location.href}
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
                  url={window.location.href}
                  // quote={props.joke.setup + props.joke.punchline}
                  hashtag="#StupidProgrammer"
                >
                  <LinkedinIcon size={25} round={true} />
                </LinkedinShareButton>
              </div>
            </div>
            <p
              style={{
                marginLeft: "10px",
                color: "gray",
                marginTop: "-5px",
                fontSize: "10px",
              }}
            >
              {post.liked.length} likes {thisImageComment.length} comments
            </p>
            <InputEmoji
              maxLength={200}
              style={{ width: "100vw", backgroundColor: "gray" }}
              value={comment}
              onChange={setComment}
              cleanOnEnter
              onEnter={PostComment}
              placeholder="Type a message and Enter "
            />
          </div>
        </div>
      </div>
    ) : (
      <div style={{ marginLeft: "14vw", marginTop: "5vh" }}>
        <img
          src={notFound}
          alt="page Not Found Try with valid link"
          style={{ width: "70vw" }}
        />
      </div>
    )
  ) : (
    <img
      src={loading}
      alt="image is loading.."
      style={{ marginLeft: "40%", marginTop: "20vh", width: "50px" }}
    />
  );
}

export default IndividualImage;
