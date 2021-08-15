import { Avatar } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { profileUser } from "../../services/firebase";

function Person({ friend, user_uid }) {
  const [ProfileUser, setProfileUser] = useState(null);

  useEffect(() => {
    async function getProfileUser() {
      const profileuser = await profileUser(friend);

      setProfileUser(profileuser);
    }

    if (friend) {
      getProfileUser();
    }
  }, [user_uid]);

  return ProfileUser ? (
    <div
      className="chatPerson__person"
      style={
        user_uid === ProfileUser[0].userId
          ? {
              padding: "10px",
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid gray",
              objectFit: "contain",
              cursor: "pointer",
              backgroundColor: "azure",
            }
          : {
              padding: "10px",
              display: "flex",
              alignItems: "center",
              borderBottom: "1px solid gray",
              objectFit: "contain",
              cursor: "pointer",
            }
      }
      key={friend.userId}
    >
      {ProfileUser[0].profile_photo ? (
        <Avatar
          src={ProfileUser[0].profile_photo}
          style={{ border: "1px solid green" }}
        />
      ) : (
        <Avatar style={{ border: "1px solid green" }} />
      )}
      <Link
        to={`/chat/${ProfileUser[0].userId}`}
        style={{ textDecoration: "none" }}
      >
        <p style={{ marginLeft: "10px" }}>{ProfileUser[0].username}</p>
      </Link>
      <Link
        to={`/profile/${ProfileUser[0].userId}`}
        style={{ marginLeft: "auto", textDecoration: "none" }}
      >
        profile
      </Link>
    </div>
  ) : null;
}

export default Person;
