import React, { useState, useEffect } from "react";
import "./likedPost.css";
import { Favorite, Message } from "@material-ui/icons";
import { LikedPosts } from "../services/firebase";
import Skeleton from "@material-ui/lab/Skeleton";
import PostShow from "./PostShow";

function LikedPost({ uid }) {
  const [likedPost, setLikedPost] = useState(null);

  useEffect(() => {
    async function getLikedPosts() {
      //  const response = await profileUser(uid);
      const posts = await LikedPosts(uid);
      // console.log(response);
      //  setProfileUser(response);
      setLikedPost(posts);
    }
    // console.log("userid", userId);
    if (uid) {
      getLikedPosts();
    }
  }, [uid]);

  return (
    <div className="likedPost">
      <div className="myPost__photo">
        {likedPost ? (
          likedPost.length === 0 ? (
            <h3> No posts You liked currently please like something..</h3>
          ) : (
            likedPost.map((post) => (
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
    </div>
  );
}

export default LikedPost;
