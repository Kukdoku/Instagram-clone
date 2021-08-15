import React, { useEffect, useState } from "react";
import { Favorite, Message } from "@material-ui/icons";
import "./myPost.css";
import { MyPosts, profileUser } from "../services/firebase";
import Skeleton from "@material-ui/lab/Skeleton";
import Usercontext from "../context/user";
import PostShow from "./PostShow";

function MyPost({ uid, setMyPostNo }) {
  const [posts, setPosts] = useState(null);
  const [ProfileUser, setProfileUser] = useState(null);
  

  useEffect(() => {
    async function getMyPosts() {
      const response = await profileUser(uid);
      const posts = await MyPosts(uid);
      // console.log(response);
      setProfileUser(response);
      setPosts(posts);
      setMyPostNo(posts.length);
    }
    // console.log("userid", userId);
    if (uid) {
      getMyPosts();
    }
  }, [uid]);
  // console.log(profileUser);
  // console.log(posts);

  return (
    <div className="myPost">
      <div className="myPost__photo">
        {posts ? (
          posts.length === 0 ? (
            <h3> No posts currently please post something..</h3>
          ) : (
            posts.map((post) => (
             <PostShow post={post} key={post.postId} postId={post.postId}/>
  
            ))
          )
        ) : (
          <>
            <div className="myPost__photo__image">
              <Skeleton variant="rect" width={150} height={750} />
            </div>
            <div className="myPost__photo__image">
              <Skeleton variant="rect" width={150} height={750} />
            </div>
            <div className="myPost__photo__image">
              <Skeleton variant="rect" width={150} height={750} />
            </div>
            <div className="myPost__photo__image">
              <Skeleton variant="rect" width={150} height={750} />
            </div>
          </>
        )}
      </div>
      <div></div>
    </div>
  );
}

export default MyPost;
