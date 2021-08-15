import React, { lazy, Suspense } from "react";
import "./App.css";
import Header from "./components/Header";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import * as ROUTES from "./constants/routes";
import useAuthListener from "./hooks/use-auth-listener";

import Usercontext from "./context/user";
import { Offline, Online } from "react-detect-offline";
import ofline from "./images/ofline.gif";

import { db } from "./firebase";

const Login = lazy(() => import("./pages/Login"));
const SignUp = lazy(() => import("./pages/SignUp"));
const NotFound = lazy(() => import("./pages/NotFound"));
// const Chat = lazy(() => import("./pages/Chat"));
const Profile = lazy(() => import("./pages/Profile"));
const Universal = lazy(() => import("./pages/Universal"));
const Home = lazy(() => import("./pages/Home"));
const ChatWith = lazy(() => import("./pages/ChatWith"));
const ImagePage = lazy(() => import("./pages/IndividualImage"));

function App() {
  const { user } = useAuthListener();

  return (
    <Usercontext.Provider value={{ user }}>
      <div className="app">
        <Online>
          <Router>
            <Header />
            <Suspense fallback={<p>Loading..........</p>}>
              <Switch>
                <Route path={ROUTES.LOGIN} component={Login} exact />
                <Route path={ROUTES.SIGN_UP} component={SignUp} exact />
                <Route path={ROUTES.HOME} component={Home} exact />
                {/* <Route path={ROUTES.CHAT} component={Chat} exact /> */}
                <Route path={ROUTES.UNIVERSAL} component={Universal} exact />
                <Route path={ROUTES.PROFILE} component={Profile} exact />
                <Route path={ROUTES.CHATWITH} component={ChatWith} />
                <Route path={ROUTES.IMAGEPAGE} component={ImagePage} />
                <Route component={NotFound} />
              </Switch>
            </Suspense>
          </Router>
        </Online>
        <Offline>
          <div style={{ backgroundColor: "#00000E", height: "100vh" }}>
            <img
              src={ofline}
              alt="Internet Connectivity is not smooth"
              style={{
                marginLeft: "30vw",
                marginTop: "10vh",
                width: "50%",
                height: "auto",
              }}
            />
          </div>
        </Offline>
      </div>
    </Usercontext.Provider>
  );
}

export default App;
