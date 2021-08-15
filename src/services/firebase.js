import { db, auth } from "../firebase";
import firebase from "firebase";

export async function doesUsernameExist(username) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", username)
    .get();

  return result.docs.map((user) => user.data().length > 0);
}

export async function findActiveUser(uid) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("userId", "==", uid)
    .get();

  const activeUser = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  // console.log("acitve", activeUser);

  return activeUser;
}

export async function profileUser(uid) {
  // console.log("hi");
  const result = await firebase
    .firestore()
    .collection("users")
    .where("userId", "==", uid)
    .get();
  const profileuser = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  // console.log(user[0].emailAddress);
  return profileuser;
}

export async function MyPosts(uid) {
  const result = await firebase
    .firestore()
    .collection("photos")
    .where("user_uid", "==", uid)
    .get();
  const posts = result.docs.map((item) => ({
    ...item.data(),
    postId: item.id,
  }));

  return posts;
}

export async function LikedPosts(uid) {
  const result = await firebase
    .firestore()
    .collection("photos")
    .where("liked", "array-contains", uid)
    .get();

  const posts = result.docs.map((item) => ({
    ...item.data(),
    postId: item.id,
  }));

  return posts;
}

export async function AllPosts() {
  const result = await firebase.firestore().collection("photos").get();

  const posts = result.docs.map((item) => ({
    ...item.data(),
    postId: item.id,
  }));

  return posts;
}

export async function getFollowingProfile(following) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("userId", "in", following)
    .get();
  const followingUser = result.docs.map((item) => ({
    ...item.data(),
    postId: item.id,
  }));
  // console.log("ok", followingUser);
  return followingUser;
}

export async function getAllPosts(following) {
  // console.log(following);
  const result = await firebase
    .firestore()
    .collection("photos")
    .where("user_uid", "in", following)
    // .orderBy("timestamp", "desc")
    .get();

  const allPosts = result.docs.map((item) => ({
    ...item.data(),
    postId: item.id,
  }));
  return allPosts;
}

export async function getSuggestedProfile(following) {
  const result = await firebase
    .firestore()
    .collection("users")
    .limit(7)
    .where("userId", "not-in", following)
    // .orderBy("timestamp", "desc")
    .get();

  const allProfile = result.docs.map((item) => ({
    ...item.data(),
    postId: item.id,
  }));
  return allProfile;
}

export async function getIndivisualPost(postId) {
  const response = await firebase.firestore().collection("photos").doc(postId);

  return response;
}

export async function getAllPostComment(postId) {
  const response = await firebase
    .firestore()
    .collection("photos")
    .doc(postId)
    .collection("comments")
  .orderBy("timestamp", "desc");
  return response;
}


export async function updateLoggedInUserFollowing(
  loggedInUserDocId,
  profileId,
  isFollowingProfile,
  following
) {
  return firebase
    .firestore()
    .collection("users")
    .doc(loggedInUserDocId)
    .update({
      following: isFollowingProfile
        ? following.arrayRemove(profileId)
        : following.arrayUnion(profileId),
    });
}


export async function updateFollowedUserFollowers(
  spdocId,
  loggedInUserDocId,
  isFollowerProfile,
  follower
) {
  return firebase
    .firestore()
    .collection("users")
    .doc(spdocId)
    .update({
      follower: isFollowerProfile
        ? follower.arrayRemove(loggedInUserDocId)
        : follower.arrayUnion(loggedInUserDocId),
    });
}