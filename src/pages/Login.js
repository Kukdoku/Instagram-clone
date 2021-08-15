import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import * as ROUTES from "../constants/routes";
import "./login.css";
import LoginImage from "../images/unnamed.png";
import firebase from "firebase";
import { db, auth } from "../firebase";
import Usercontext from "../context/user";
import { Button, Input } from "@material-ui/core";

function Login() {
  const history = useHistory();
  const user = useContext(Usercontext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(true);

  const handleLogin = async (event) => {
    event.preventDefault();

    // firebase.auth().signInWithEmailAndPassword(emailAddress, password).then(() =>
    //    history.push(ROUTES.DASHBOARD)
    // ).catch((error) => {
    //        setEmailAddress("");
    //   setPassword("");
    //   setError(error.message);
    // })
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      history.push(ROUTES.HOME);
      window.location.reload();
    } catch (error) {
      setEmail("");
      setPassword("");
      setError(error.message);
    }
  };
  useEffect(() => {
    document.title = "photogram-Login";
  }, []);

  return user.user ? (
    <p style={{ textAlign: "center" }}>
      {" "}
      logout first then then enter this page
    </p>
  ) : (
    <div className="login">
      <div className="login__left">
        <img src={LoginImage} alt="login image" className="login_image" />
      </div>
      <div className="login__right">
        <h2 style={{ textAlign: "center" }}> Login</h2>
        <p style={{ color: "red" }}>{error}</p>
        <form onSubmit={handleLogin} className="login__form">
          <Input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email Address :"
          />

          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password :"
            style={{ marginTop: "10px", marginBottom: "10px" }}
          />
          <Button
            type="submit"
            variant="contained"
            style={{ marginBottom: "10px" }}
            disabled={!password || !email}
          >
            Login
          </Button>
        </form>
        <p sytle={{ marginTop: "10px" }}>
          for guest user emailId: <b>guestuser@gmail.com</b> and password:
          <b>123456789</b>
        </p>
        <p sytle={{ marginTop: "10px" }}>
          Don't Have an account <Link to={ROUTES.SIGN_UP}>SignUp</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
