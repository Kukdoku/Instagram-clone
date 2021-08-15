import { Avatar } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import "./followeBarData.css";

function FollowerBarData({ follow }) {
  // console.log(follow.postId);
  // console.log(follow);
  return (
    <div className="followerBar__follower">
      {follow.profile_photo !== "" ? (
        <Link to={`/profile/${follow.userId}`}>
          <Avatar className="followerBar__avatar" src={follow.profile_photo} />
        </Link>
      ) : (
        <Link to={`/profile/${follow.userId}`}>
          <Avatar className="followerBar__avatar" />
        </Link>
      )}

      <p style={{ fontSize: "9px" }}>{follow.username}</p>
    </div>
  );
}

export default FollowerBarData;
