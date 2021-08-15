import { Avatar } from "@material-ui/core";
import Skeleton from "@material-ui/lab/Skeleton";
import React, { useState, useEffect } from "react";
import "./chatMessageHeader.css";
import { profileUser } from "../../services/firebase";

function ChatMessageHeader({ user_uid, activeUser }) {
  const [profile, setProfile] = useState(null);
  // console.log(user_uid);

  useEffect(() => {
    async function getProfileUser() {
      const profileuser = await profileUser(user_uid);

      // console.log(profileuser);
      setProfile(profileuser);
    }
    // console.log("userid", userId);
    if (user_uid !== "home") {
      getProfileUser();
    }
  }, [user_uid]);
  // console.log(profile);
  // console.log("useruid", user_uid);

  return (
    <div className="chatMessageHeader">
      {profile ? (
        <div className="chatMessageHeader__left">
          {profile[0].profile_photo ? (
            <Avatar
              className="chatMessageHeader__avatar"
              src={profile[0].profile_photo}
              style={{ border: "2px solid gray" }}
            />
          ) : (
            <Avatar className="chatMessageHeader__avatar" />
          )}

          <h3 style={{ marginLeft: "10px", textShadow: "2px 2px 5px red" }}>
            {profile[0].username}
          </h3>
        </div>
      ) : (
        <div className="chatMessageHeader__left">
          <Skeleton variant="circle" width={40} height={40} />
          <Skeleton variant="text" width={30} height={50} />
        </div>
      )}
    </div>
  );
}

export default ChatMessageHeader;
