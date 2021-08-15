import { Avatar } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import React, { useState, useContext, useEffect } from "react";
import Usercontext from "../context/user";
import "./followerbar.css";
import firebase from "firebase";
import { db, auth, storage } from "../firebase";
import FollowerBarData from "./FollowerBarData";
import { findActiveUser, getFollowingProfile } from "../services/firebase";

function FollowerBar() {
  const [following, setFollowing] = useState(null);
  const user = useContext(Usercontext);
  // const [activeUser, setActiveUser] = useState(null);

  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  useEffect(() => {
    async function getMyFollowing() {
      const response = await findActiveUser(user.user.uid);
      const following = await response[0].following;
      // console.log(following);
      const followingResponse = await getFollowingProfile(following);
      // console.log("followingResponse", followingResponse);
      setFollowing(followingResponse);
    }

    if (user.user) {
      getMyFollowing();
    }
  }, [user]);
  // console.log(following);

  return (
    <div className="followerBar">
      {following
        ? following.map((follow) => (
            <FollowerBarData follow={follow} key={follow.postId} />
          ))
        : arr.map((t) => (
            <div className="followerBar__follower" key={t}>
              <Skeleton variant="circle" width={40} height={40} />
              <Skeleton variant="text" />
            </div>
          ))}
    </div>
  );
}

export default FollowerBar;
