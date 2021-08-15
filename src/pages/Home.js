import React, { useContext } from "react";
import Dashboard from "../components/Dashboard";
import FollowerBar from "../components/FollowerBar";
import Timeline from "../components/Timeline";
import Usercontext from "../context/user";
import "./home.css";
import * as ROUTES from "../constants/routes";
import { Link } from "react-router-dom";
import { Offline, Online } from "react-detect-offline";





function Home() {
  var myParam = window.location.search.split("profile/")[1];
  // console.log(myParam);
  const user = useContext(Usercontext);

  
  return user.user ? (
    
    <div className="home">
  
    
      <div></div>

      <div>
        <FollowerBar />
        <Dashboard />
      </div>

      <Timeline />
      <div></div>
    </div>
  ) : (
    <div>
      <h1 style={{ textAlign: "center", color: "gray" }}>
        {" "}
        Login For post Images
      </h1>
      <p style={{ textAlign: "center",marginTop: '20px' }}>
        <Link to={ROUTES.LOGIN} style={{textDecoration:'none'}}>Login</Link>
      </p>
      {/* <img src={} alt="home Image"/>  */}
      
    </div>
   
    
  )
}

export default Home;
