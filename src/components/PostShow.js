import { Favorite, Message } from "@material-ui/icons";
import React, { useEffect } from "react";
import "./postShow.css";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import PostPopup from "./PostPopup";
import { getAllPostComment } from "../services/firebase";
import ReactPlayer from "react-player";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import vidoeicon from '../images/vidoeicon.png'
import imageIcon from '../images/imageIcon.png'

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

    padding: theme.spacing(0, -5, 2),
    backgroundColor: " rgba(255,255,255,0.9)",
  },
}));

function PostShow({ post, postId }) {
  const classes = useStyles();

  // console.log(post.type);
  // console.log(post.fileUrl);

  const [modalStyle] = React.useState(getModalStyle);
  const [open, setOpen] = React.useState(false);
  const [postComment, setPostComment] = React.useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    async function getComment() {
      const result = await getAllPostComment(postId);
      await result.onSnapshot((snapshot) => {
        setPostComment(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }))
        );
      });
    }

    if (postId !== "") {
      getComment();
    }
  }, [postId]);

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <PostPopup post={post} postId={postId} />
    </div>
  );
  return (
    <div className="universal__image" key={post.postId}>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {body}
      </Modal>
      {post.type === "video" ? (
        <ReactPlayer
          url={post.fileUrl}
          alt="video"
          className="inner-image portrait"
          onClick={handleOpen}
          width="300px"
          height="300px"
        />
      ) : (
        <img
          src={post.fileUrl}
          alt="image"
          className="inner-image portrait"
          onClick={handleOpen}
        />
      )}
      <div className="middle">
        <p style={{ display: "flex", alignItems: "center" }}>
          {post.liked.length}
          <Favorite /> {postComment.length}
          <Message />
        </p>
      </div>

      <div className="corner">
        {post.type === "video" ? (
          <img src={vidoeicon} alt="video" className="icon"/>
        ) : (
          <img src={imageIcon} alt="image" className="icon"/>
        )}
      </div>
    </div>
  );
}

export default PostShow;
