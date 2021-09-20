import React, { useContext, useState,useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import AuthDataService from "../services/authService";
import { useAuth0 } from "@auth0/auth0-react";
import { UserContext } from "../context/UserContext";



const Login = () => {

  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userContext, setUserContext] = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSubmitHandler = e => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const errorMessage = "Something went wrong! Please try again later.";

    fetch(process.env.REACT_APP_API_ENDPOINT+ "users/login", {
      method: "POST",
      credentials: "include",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({email: email, password: password})
    })
    .then(async response => {
      setIsSubmitting(false);
      if(!response.ok){
        if(response.status === 400){
          setError("Please fill out all fields correctly.");
        }
        else if(response.status === 401){
          setError("Invalid email and/or password combination");
        }
        else {
          setError(errorMessage);
        }
      }

      else{
        const data = await response.json();
        setUserContext(oldUserValues => {
          return {...oldUserValues, token:data.token};
        });
        history.push("/movies");
        console.log(userContext);
      }
    })
    .catch(e =>{
      setIsSubmitting(false);
      setError(errorMessage);
    });
  }


  return(
    <div className="container-fluid pt-5 pb-5 pr-5 pl-5">
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row d-flex justify-content-center align-items-center">
        <div className="col-md-6">
          <img className="img-fluid" src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80"/>

        </div>
        <div className="col-md-6 justify-content-center">
        <h1 className="text-center pb-3">Please turn off your cell phone...</h1>
          <form className="" onSubmit={formSubmitHandler}>
            <input
              className="form-control mb-4"
              id="email"
              placeholder="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              className="form-control mb-4"
              id="password"
              placeholder="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button
            className="btn btn-primary btn-lg"
            type="submit"
            disabled={isSubmitting}
            >{`${isSubmitting ? "Logging In" : "Login"}`}</button>
          </form>
          <h3 className="text-center pb-3">... unless that&apos;s what you&apos;re using to view this page!</h3>
          <p className="small fw-bold mt-2 pt-1 mb-0">Don&apos;t have an account? <Link to="/register" className="link-danger">Register</Link></p>
        </div>
      </div>
    </div>
  )

};

export default Login;
