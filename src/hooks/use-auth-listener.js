import React, { useState, useEffect, useContext } from "react";
import { auth } from "../firebase";
import firebase from "firebase";

function useAuthListener() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("authUser"))
  );

  useEffect(() => {
    const listener = firebase.auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        localStorage.setItem("authUser", JSON.stringify(authUser));
        setUser(authUser);
      } else {
        localStorage.removeItem("authUser");
        setUser(null);
      }
    });
    return () => listener();
  }, [firebase]);

  return { user };
}

export default useAuthListener;
