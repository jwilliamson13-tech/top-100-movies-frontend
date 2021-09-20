import React, { useState,useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import AuthDataService from "../services/authService";
import { useAuth0 } from "@auth0/auth0-react";
import { UserContext } from "../context/UserContext";



const Register = () => {

  const history = useHistory();

  const[isSubmitting, setIsSubmitting] = useState(false);
  const[error,setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [userContext, setUserContext] = useContext(UserContext);


  const formSubmitHandler = e => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const errorMessage = "Something went wrong! Please try again later.";

    fetch(process.env.REACT_APP_API_ENDPOINT + "users", {
      method: "POST",
      credentials: "include",
      headers:{"Content-Type":"application/json"},
      body: JSON.stringify({email:email,password:password,password2:password2})
    })
    .then(async response => {
      setIsSubmitting(false);
      if(!response.ok){
        if(response.status === 400){
          setError("Please fill out all fields correctly!");
        }
        else if(response.status === 401) {
          setError("Invalid email and/or password.");
        }
        else if(response.status === 500){
          console.error("Error registering user: ", response);
          const data = await response.json();
          if(data.message) {
            setError(data.message || errorMessage);
          }
        }
        else{
          setError(errorMessage);
        }
      }
      else{
        const data = await response.json();
        setUserContext(oldUserValues => {
          return {...oldUserValues, token:data.token};
        });
        history.push("/login");
        console.log(userContext);
      }
    })
    .catch(e => {
      setIsSubmitting(false);
      setError(errorMessage);
    })
  }

  return(
    <div className="container-fluid pt-5 pb-5 pr-5 pl-5">
    {error && <div className="alert alert-danger">{error}</div>}
      <div className="row d-flex justify-content-center align-items-center">
        <div className="col-md-6">
          <img className="img-fluid" src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80"/>
        </div>
        <div className="col-md-6 justify-content-center">
          <h1 className="text-center pb-3">We&apos;re Glad To Have You!</h1>
          <h3 className="text-center pb-3">Please Register Below</h3>
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
            <input
              className="form-control mb-4"
              id="password2"
              placeholder="Confirm Password"
              type="password"
              value={password2}
              onChange={e => setPassword2(e.target.value)}
            />
            <button class="btn-primary btn-lg" type="submit" disabled={isSubmitting}>{`${isSubmitting ? "Registering" : "Register"}`}</button>
          </form>
        </div>
      </div>
    </div>
  )

};

export default Register;
