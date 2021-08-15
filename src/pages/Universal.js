import { Favorite, Message } from "@material-ui/icons";
import React, { useState, useEffect } from "react";
import "./universal.css";
import { AllPosts } from "../services/firebase";
import Skeleton from "@material-ui/lab/Skeleton";
import PostShow from "../components/PostShow";

function Universal() {
  const [allPosts, setAllPosts] = useState(null);

  useEffect(() => {
    async function getLikedPosts() {
      const posts = await AllPosts();

      setAllPosts(posts);
    }

    getLikedPosts();
  }, []);

  return (
    <div className="universal">
      {allPosts ? (
        allPosts.map((post) => (
          <PostShow post={post} key={post.postId} postId={post.postId}/>
        ))
      ) : (
        <div className="universal__image__skelton">
          <Skeleton
            variant="rect"
            width={200}
            height={200}
            className="sklton"
          />
          <Skeleton
            variant="rect"
            width={200}
            height={200}
            className="sklton"
          />
          <Skeleton
            variant="rect"
            width={200}
            height={200}
            className="sklton"
          />
          <Skeleton
            variant="rect"
            width={200}
            height={200}
            className="sklton"
          />
          <Skeleton
            variant="rect"
            width={200}
            height={200}
            className="sklton"
          />
          <Skeleton
            variant="rect"
            width={200}
            height={200}
            className="sklton"
          />
          <Skeleton
            variant="rect"
            width={200}
            height={200}
            className="sklton"
          />
          <Skeleton
            variant="rect"
            width={200}
            height={200}
            className="sklton"
          />
          <Skeleton
            variant="rect"
            width={200}
            height={200}
            className="sklton"
          />
        </div>
      )}
    </div>
  );
}

export default Universal;
