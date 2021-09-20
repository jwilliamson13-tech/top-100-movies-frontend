import React, { useState,useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import AuthDataService from "../services/authService";
import { useAuth0 } from "@auth0/auth0-react";
import { UserContext } from "../context/UserContext";

const Logout = () => {

  const history = useHistory();

  const [userContext, setUserContext] = useContext(UserContext);

  const logoutHandler = () => {
    fetch(process.env.REACT_APP_API_ENDPOINT + "users/logout", {
      credentials: "include",
      headers: {
        "Content-Type": "application-json",
        Authorization: `Bearer ${userContext.token}`
      }
    })
    .then(async response => {
      setUserContext(oldUserValues => {
        return {...oldUserValues, details: undefined, token: null};
      });
      history.push("/");
    })
  }

  useEffect(()=>{
    logoutHandler();
  }, []);

  return(
    <div>
      LOGOUT
    </div>
  )

};

export default Logout;
