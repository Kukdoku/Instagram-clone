import { Avatar, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase";

function Following({ uid, following, setOpen }) {

  const [followingList, setFollowingList] = useState();
  useEffect(() => {
    async function getFollowingUser() {
      const result = await firebase
        .firestore()
        .collection("users")
        .where("userId", "in", following)
        .get();
      const allPosts = result.docs.map((item) => ({
        ...item.data(),
        profileId: item.id,
      }));
      setFollowingList(allPosts);
    }

    if (uid && following) {
      getFollowingUser();
    }
  }, [uid]);


  return (
    <div style={{ overflow: "scroll", height: "105%", scrollX: "hidden" }}>
      <h3
        style={{
          textAlign: "center",
          borderBottom: "2px solid gray",
          paddingBottom: "10px",
        }}
      >
        Following
      </h3>
      <div>
        {followingList
          ? followingList.map((following) => (
              <div
                className="following"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                }}
                key={following.userId}
              >
                <div
                  className="following__left"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {following.profile_photo !== "" ? (
                    <Avatar
                      src={following.profile_photo}
                      style={{ border: "2px solid green" }}
                    />
                  ) : (
                    <Avatar style={{ border: "2px solid red" }} />
                  )}

                  <h4 style={{ marginLeft: "10px" }}>{following.username}</h4>
                </div>
                <div
                  className="following__right"
                  onClick={() => setOpen(false)}
                >
                  <Link to={`/profile/${following.userId}`}>profile</Link>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default Following;
