import { Button } from "@material-ui/core";
import React, { useState } from "react";

function FollowButton({ activeUser_uid, profileUser }) {

  const [isfollowing, setIsFollowing] = useState("GETTING...");

  const getStatus = () => {
    if (profileUser.follower.includes(activeUser_uid)) {
      
      setIsFollowing(true);
    } else  {
    
      setIsFollowing(false);
    }
   
  };

  if (activeUser_uid && profileUser) {
    getStatus();
  }

  return (
    <div
      className="followButton"
      style={{ marginLeft: "5px", marginRight: "5px" }}
    >
      {isfollowing === "GETTING..." ? (
        <Button style={{ color: "blue" }} variant="outlined">
          GETTING...
        </Button>
      ) : isfollowing ? (
        <Button style={{ color: "blue" }} variant="outlined">
          FOLLOWING
        </Button>
      ) : (
        <Button style={{ color: "blue" }} variant="outlined">
          Follow
        </Button>
      )}
    </div>
  );
}

export default FollowButton;
