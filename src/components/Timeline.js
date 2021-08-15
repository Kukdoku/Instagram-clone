import { Avatar, Button } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Usercontext from "../context/user";
import { findActiveUser, getSuggestedProfile } from "../services/firebase";
import "./timeline.css";

function Timeline() {
  const user = useContext(Usercontext);
  const [activeUser, setActiveUser] = useState(null);
  const [suggestion, setSuggestion] = useState(null);

  // if (user) {
  //   console.log(user.user.uid);
  // }

  useEffect(() => {
    async function getActiveUser() {
      const activeuser = await findActiveUser(user.user.uid);
      const actUsr = await activeuser;

      setActiveUser(actUsr);
      // console.log("now", activeuser);

      const suggestedprofile = await getSuggestedProfile(actUsr[0].following);
      setSuggestion(suggestedprofile);
    }

    if (user.user) {
      getActiveUser();
    }
  }, [user]);

  return (
    <div className="timeline">
      {user.user && activeUser ? (
        <div className="timeline__header">
          <Link to={`/profile/${user.user.uid}`}>
            <Avatar
              src={activeUser[0].profile_photo}
              alt="profilePhoto"
              style={{ border: "1px solid black", marginRight: "10px" }}
            />
          </Link>

          <p>
            <b style={{ fontSize: "17px" }}>{activeUser[0].username}</b>{" "}
            <span style={{ fontSize: "10px" }}>{activeUser[0].fullName}</span>
          </p>
        </div>
      ) : (
        <div className="timeline__header">
          <Skeleton variant="circle" width={50} height={50} />
          <Skeleton
            variant="text"
            width={70}
            height={30}
            className="timeline__username"
          />
        </div>
      )}
      <p
        style={{
          color: "gray",
          fontSize: "15px",
          marginTop: "3vh",
        }}
      >
        Suggestion For You
      </p>
      {user.user && activeUser && suggestion ? (
        suggestion.map((suggest) => (
          <div className="timeline__suggestion" key={suggest.postId}>
            <div
              className="timeline__suggestion__left"
              style={{ display: "flex", marginTop: "15px" }}
            >
              {suggest.profile_photo ? (
                <Avatar
                  style={{ marginRight: "5px", border: "1px solid gray" }}
                  src={suggest.profile_photo}
                />
              ) : (
                <Avatar
                  style={{ marginRight: "5px", border: "1px solid gray" }}
                />
              )}
              <p style={{fontSize:'12px'}}>{suggest.username}</p>
            </div>
            <div className="timeline__suggestion__left">
              <h4 style={{ color: "blue" }}>
                <Link to={`/profile/${suggest.userId}`} style={{textDecoration:'none',fontSize:"12px"}}>profile</Link>
              </h4>
            </div>
          </div>
        ))
      ) : (
        <div className="timeline__suggestion">
          <div className="timeline__suggestion__left">
            <Skeleton variant="circle" width={40} height={40} />
            <Skeleton
              variant="text"
              width={70}
              height={20}
              className="timeline__suggestion__left__text"
            />
          </div>

          <Skeleton variant="text" width={45} height={30} />
        </div>
      )}
    </div>
  );
}

export default Timeline;
