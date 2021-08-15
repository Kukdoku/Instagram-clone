import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import * as ROUTES from "../constants/routes";
import SignupImage from "../images/unnamed.png";
import { doesUsernameExist } from "../services/firebase";
import firebase from "firebase";
import { db, auth } from "../firebase";

import "./signup.css";
import Usercontext from "../context/user";
import { Button, Input } from "@material-ui/core";

function SignUp() {
  const history = useHistory();
  const user = useContext(Usercontext);
  const [name, setName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setComfirmPassword] = useState("");
  const [error, setError] = useState("");

  const isInvalid =
    name.trim() === "" ||
    userName.trim() === "" ||
    email.trim() === "" ||
    password.trim() === "" ||
    confirmPassword.trim() === "";

  const signUp = async (e) => {
    e.preventDefault();

    const usernameExists = await doesUsernameExist(userName);
    // console.log(usernameExists);

    if (password === confirmPassword) {
      if (!usernameExists.length) {
        // console.log("hello");
        try {
          const createdUserResult = await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password);

          await createdUserResult.user.updateProfile({
            displayName: userName,
          });

          await firebase
            .firestore()
            .collection("users")
            .add({
              userId: createdUserResult.user.uid,
              profile_photo: "",
              chat_friends: [],
              chatUrl: {},
              username: userName.toLowerCase(),
              fullName: name.toLowerCase(),
              emailAddress: email.toLowerCase(),
              following: [createdUserResult.user.uid],
              follower: [createdUserResult.user.uid],
              dateCreated: Date.now(),
              profilePicUpdatedAt: "",
              status: "",
            });
          history.push(ROUTES.HOME);
          window.location.reload()
        } catch (error) {
          setName("");
          setUserName("");
          setEmail("");
          setPassword("");
          setComfirmPassword("");
          setError(error.message);
        }
      } else {
        setError("This username is already taken");
      }
    } else {
      setError("password and confirm password did not match");
    }
  };

  return user.user ? (
    <p>
      {" "}
      Sorry permission denied, You have to SignOout first for entering this page{" "}
    </p>
  ) : (
    <div className="signup">
      <div className="signup__left">
        <img src={SignupImage} alt="signup image" className="signup_image" />
      </div>
      <div className="signup__right">
        <h2 style={{ textAlign: "center" }}> SignUp</h2>
        {error && <p style={{ color: "red" }}> {error}</p>}
        <form onSubmit={signUp} className="signup__form">
          <Input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Username :"
            className="signup__input"
          />

          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name :"
            className="signup__input"
          />

          <Input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="signup__input"
          />

          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password :"
            className="signup__input"
          />

          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setComfirmPassword(e.target.value)}
            placeholder="Confirm Password :"
            className="signup__input"
          />
          <Button type="submit" disabled={isInvalid} className="signup__input" variant="contained">
            SignUp
          </Button>
        </form>
        <p>
          {" "}
          if you have a account <Link to={ROUTES.LOGIN}>Login</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
