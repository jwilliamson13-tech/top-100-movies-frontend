import React, { useState, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import Login from "../components/login";
import Logout from "../components/logout";
import { UserContext } from "../context/UserContext";

const Navbar = props => {

  const [userContext, setUserContext] = useContext(UserContext);

  //Need to compartmentalize this
  const fetchUserDetails = useCallback(() => {
    fetch(process.env.REACT_APP_API_ENDPOINT +"users/user", {
      method:"GET",
      credentials:"include",
      headers: {
        "Content-Type":"application/json",
        Authorization: `Bearer ${userContext.token}`
      }
    })
    .then(async response =>{
      if(response.ok){
        const data = await response.json();
        setUserContext(oldUserValues => {
          return {...oldUserValues, details:data};
        });
      }
      else{
        if(response.status === 401){
          console.log("RIP");
          //window.location.reload()
        }
        else{
          setUserContext(oldUserValues => {
            return {...oldUserValues, details:null};
          });
        }
      }
    })
  }, [setUserContext, userContext.token]);

/*
return (
  <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
    <Link className="navbar-brand" to="">Top 100 Movies</Link>
    <ul className="navbar-nav mr-auto">
      <li className="nav-item">
        <a className="nav-link" href="/movies">Movies</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/profiles">Profiles</a>
      </li>
      <li className="nav-item">
        <a className="nav-link" href="/profile">Profile</a>
      </li>
      {
        userContext.token != undefined && userContext.token != null ?
        <li className="nav-item">
          <a className="nav-link" href="/logout">Logout</a>
        </li>
        :
        <li className="nav-item">
          <a className="nav-link" href="/login">Login</a>
        </li>

        }
      }
    </ul>
  </nav>
);
*/

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand" to="">Top 100 Movies</Link>
      <ul className="navbar-nav mr-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/movies" onClick={fetchUserDetails}>Movies</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/profiles" onClick={fetchUserDetails}>Profiles</Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/profile" onClick={fetchUserDetails}>Profile</Link>
        </li>
        {
          userContext.token != undefined && userContext.token != null ?
          <li className="nav-item">
            <Link className="nav-link" to="/logout">Logout</Link>
          </li>
          :
          <li className="nav-item">
            <Link className="nav-link" to="/login">Login</Link>
          </li>

          }
        }
      </ul>
    </nav>
  );

};

export default Navbar;
