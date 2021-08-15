import { Avatar, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase";
import { BorderRight } from "@material-ui/icons";

function Follower({ uid, follower, setOpen }) {
  const [followerList, setFollowerList] = useState();
  useEffect(() => {
    async function getFollowerList() {
      const result = await firebase
        .firestore()
        .collection("users")
        .where("userId", "in", follower)
        .get();
      const allPosts = result.docs.map((item) => ({
        ...item.data(),
        profileId: item.id,
      }));
      setFollowerList(allPosts);
    }

    if (uid && follower) {
      getFollowerList();
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
        Follower
      </h3>
      <div>
        {followerList
          ? followerList.map((follower) => (
              <div
                className="following"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                }}
                key={follower.userId}
              >
                <div
                  className="following__left"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {follower.profile_photo !== "" ? (
                    <Avatar
                      src={follower.profile_photo}
                      style={{ border: "2px solid green" }}
                    />
                  ) : (
                    <Avatar style={{ border: "2px solid red" }} />
                  )}

                  <h4 style={{ marginLeft: "10px" }}>{follower.username}</h4>
                </div>
                <div
                  className="following__right"
                  onClick={() => setOpen(false)}
                >
                  <Link to={`/profile/${follower.userId}`}>profile</Link>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
}

export default Follower;
