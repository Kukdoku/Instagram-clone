import Skeleton from "@material-ui/lab/Skeleton";
import React, { useState, useEffect, useContext } from "react";
import Usercontext from "../context/user";
import { findActiveUser, getAllPosts } from "../services/firebase";
import Post from "./Post";

function Dashboard() {
  const user = useContext(Usercontext);
  const [posts, setPosts] = useState(null);

  useEffect(() => {
    async function getAllFollowingPosts() {
      const activeUser = await findActiveUser(user.user.uid);
      let following = await activeUser[0].following;
      // console.log(follower[0].following);
      const allfollowingPosts = await getAllPosts(following);
      // console.log(allfollowingPosts);
      setPosts(allfollowingPosts);
    }
    // console.log("userid", userId);
    if (user.user) {
      getAllFollowingPosts();
    }
  }, []);
  // console.log(posts);
  return (
    <div className="dashboard">
    
      {posts ? (
        posts.map((post) => <Post key={post.postId} postId={post.postId} uploaderId={post.user_uid} />)
      ) : (
        <Post post={null} />
      )}
    </div>
  );
}

export default Dashboard;
