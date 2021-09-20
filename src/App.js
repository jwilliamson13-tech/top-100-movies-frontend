import logo from './logo.svg';
import './App.css';
import {Route,Switch,Link} from "react-router-dom";
import {useCallback, useContext, useState, useEffect} from "react";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import Dashboard from "./components/dashboard";
import Movies from "./components/movies";
import Profiles from "./components/profiles";
import Profile from "./components/profile";
import Login from "./components/login";
import Logout from "./components/logout";
import Register from "./components/register";
import OtherProfile from "./components/otherProfile";
import { UserContext } from "./context/UserContext";
import { ProfileContext } from "./context/ProfileContext";
import userDataService from "./services/userDataService";

function App() {
  const [userContext, setUserContext] = useContext(UserContext);
  const [profileContext, setProfileContext] = useContext(UserContext);
  const [userId, setUserId] = useState();

  const verifyUser = useCallback(() => {
    fetch(process.env.REACT_APP_API_ENDPOINT +"users/refreshToken", {
      method: "POST",
      credentials: "include",
      headers: {"Content-Type":"application/json"}
    })
    .then(async response => {
      if(response.ok){
        const data = await response.json();
        setUserContext(oldUserValues => {
          return {...oldUserValues, token:data.token};
        });
        console.log(userContext);
      }
      else{
        setUserContext(oldUserValues => {
          return {...oldUserValues, token:null};
        });
        console.log(userContext);
      }
      //Need to find a more elegant solution because this will interrupt whatever the user is doing to refresh
      setTimeout(verifyUser, 59 * 60 * 1000);
    })
  }, [setUserContext]);

  useEffect(() => {
    verifyUser()
    console.log(userContext);
  }, [verifyUser]);

  //Add this to anywhere you need the user's details
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
          console.log("THIS ERROR IS BROUGHT TO YOU BY APP JS");
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

  //This is the weirdest workaround, but I am burned out after 3 weeks of 25 - 30 hours extra work not counting travel
  const fetchProfileDetails = useCallback(() => {
    fetch(process.env.REACT_APP_API_ENDPOINT +"users/"+userId, {
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
        setProfileContext(data);
      }
      else{
        if(response.status === 401){
          console.log("RIP");
          //window.location.reload()
        }
        else{
          setProfileContext(null);
        }
      }
    })
  });

  useEffect(()=>{
    if (!userContext.details) {
      fetchUserDetails()
      //setUserId(userContext.details._id);
    }
    console.log(userContext.details);
  }, [userContext.details, fetchUserDetails]);



  return (
    <div className="outerJSXWrapper">
      <Navbar/>
      <Switch>
        <Route exact path="/" component={Dashboard}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/movies" component={() => <Movies props={fetchUserDetails}/>} onEnter={() => fetchUserDetails}/>
        <Route exact path="/profile/:userId" component={OtherProfile} onEnter={() => fetchUserDetails}/>
        <Route exact path="/profiles" component={Profiles} onEnter={() => fetchUserDetails}/>
        <Route path="/profile" component={Profile} onEnter={() => fetchUserDetails}/>
        <Route path="/logout" component={Logout}/>
      </Switch>
      <Footer/>
    </div>
  );
}

/*
  Removed the html below that was wrapping everything
    <div className="container-fluid">
    </div>
*/
export default App;
