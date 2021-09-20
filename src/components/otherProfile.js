import React, { useState,useEffect, useContext, useCallback } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import MovieCard from "../components/movieCard";
import DataService from "../services/userDataService";
import AuthService from "../services/authService";
import { useAuth0 } from "@auth0/auth0-react";
import { UserContext } from "../context/UserContext";
import userDataService from "../services/userDataService";

const OtherProfile = props => {
  const history = useHistory();
  const [userContext, setUserContext] = useContext(UserContext);
  //const [profileContext, setProfileContext] = useContext(UserContext);
  const [movies, setMovies] = useState([]);
  const [profile, setProfile] = useState();
  const [buttonText, setButtonText] = useState("");
  const [error, setError] = useState("");

  const params = useParams();

  const userId = params.userId;

  var accessToken;


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

  useEffect(() => {

    //Get profile info for page population
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
        setProfile(data);
      }
      else{
        if(response.status === 401){
          console.log("COULDNT FETCH PROFILE DETAILS");
          history.push('/');
          //window.location.reload()
        }
        else{
          setProfile(null);
        }
      }
    })

    //Find if user already follows this profile
    if(userContext.details){
      if(userContext.details.following.includes(userId)){
        setButtonText("Unfollow");
      }
      else{
        setButtonText("Follow")
      }
    }
  },[userContext]);

  function follow(){
    var errorMessage = "Error with user system. Please try again later.";
    fetch(process.env.REACT_APP_API_ENDPOINT +"api/v1/follow", {
      method:"POST",
      credentials:"include",
      headers: {
        "Content-Type":"application/json",
        Authorization: `Bearer ${userContext.token}`
      },
      body: JSON.stringify({id:userContext.details._id,followId:userId})
    })
    .then(async response =>{
      if(response.ok){
        setButtonText("Unfollow");
      }
      else{
        if(response.status === 401){
          setError("Not signed in. Please sign in to add followers.");
          //window.location.reload()
        }
        else{
          setError(errorMessage);
        }
      }
    })
  }

  function unfollow(){
    var errorMessage = "Error with user system. Please try again later.";
    fetch(process.env.REACT_APP_API_ENDPOINT +"api/v1/unfollow", {
      method:"POST",
      credentials:"include",
      headers: {
        "Content-Type":"application/json",
        Authorization: `Bearer ${userContext.token}`
      },
      body: JSON.stringify({id:userContext.details._id,followId:userId})
    })
    .then(async response =>{
      if(response.ok){
        setButtonText("Follow");
      }
      else{
        if(response.status === 401){
          setError("Not signed in. Please sign in to add followers.");
          //window.location.reload()
        }
        else{
          setError(errorMessage);
        }
      }
    })
  }

  function buttonController(){
    if(buttonText == "Follow"){
      follow();
    }
    if(buttonText == "Unfollow"){
      unfollow();
    }
  }

  function movieInUserFavorites(movieId){
    var favoriteMovies = Object.entries(userContext.details.favorite_movies);
    for(var i = 0; i < favoriteMovies.length; i++){
      if(favoriteMovies[i][1].id == movieId){
        return true;
      }
    }
    return false;
  }


  function topThreeMovies(){
    if(Object.entries(profile.favorite_movies).length > 0){
      var movieRanks = Object.keys(profile.favorite_movies);
      var topThreeMoviesArray = [];
      for(var i = 0; i < Math.min(movieRanks.length,3); i++){
        var currentMovie = profile.favorite_movies[movieRanks[i]];
        //Make a movie card for each and push
        var movieImage = currentMovie.poster_path ? "https://image.tmdb.org/t/p/w185/" + currentMovie.poster_path : "./NoMovieImage.jpg"

          topThreeMoviesArray.push(<MovieCard movie={{currentMovie,"image":movieImage,"movieAlreadyAdded":movieInUserFavorites(currentMovie.id)}}/>);

        //topThreeMoviesArray.push(userContext.details.favorite_movies[movieRanks[i]]);
      }
      //var sortedFavMovies = new Map([...userContext.details.favorite_movies].sort());
      console.log("TOP THREE MOVIES");
      console.log(topThreeMoviesArray);

      return(topThreeMoviesArray);
    }
  }

  function topOneHundredMovies(){
    if(Object.entries(profile.favorite_movies).length > 0){
      var movieRanks = Object.keys(profile.favorite_movies);
      var favoriteMovies = [];
      for(var i = 0; i < movieRanks.length; i++){
        var currentMovie = profile.favorite_movies[movieRanks[i]];
        console.log(currentMovie);
        //Make a movie card for each and push
        var movieImage = currentMovie.poster_path ? "https://image.tmdb.org/t/p/w185/" + currentMovie.poster_path : "./NoMovieImage.jpg"

          favoriteMovies.push(<MovieCard movie={{currentMovie,"image":movieImage,"movieAlreadyAdded":movieInUserFavorites(currentMovie.id)}}/>);

        //topThreeMoviesArray.push(userContext.details.favorite_movies[movieRanks[i]]);
      }
      //var sortedFavMovies = new Map([...userContext.details.favorite_movies].sort());
      console.log(favoriteMovies);

      return(favoriteMovies);
    }
  }

  return (profile == null || !userContext.details) ? (
    <div className="container mt-3">
      <h1>LOADING...</h1>
    </div>) :
    (

      <div className="container mt-3">
        <div className="row">
          <div className="col-lg-4">
            <h1>Email: {profile.email}</h1>
            <h3>Movies Favorited: {Object.entries(profile.favorite_movies).length}</h3>
            <button className="btn btn-primary text-center" type="button" onClick={buttonController}>{buttonText}</button>
          </div>
          <div className="col-lg-8 align-self-center">
            <h3 className="text-center">Top 3 Movies</h3>
            <div className="row pt-3">
              {
                topThreeMovies()
              }
            </div>
          </div>
        </div>
        <div className="row pt-3">
          <h3 className="text-center">Top 100 Movies</h3>
          {
            topOneHundredMovies()
          }
          <div className="row pt-3 pb-3 justify-content-center">
          </div>
        </div>
      </div>
    );
};

export default OtherProfile;
