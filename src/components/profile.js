import React, { useState,useEffect, useContext, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import MovieCard from "../components/movieCard";
import DataService from "../services/userDataService";
import AuthService from "../services/authService";
import { useAuth0 } from "@auth0/auth0-react";
import { UserContext } from "../context/UserContext";
import { CopyToClipboard } from "react-copy-to-clipboard";

const Profile = props => {
  const [userContext, setUserContext] = useContext(UserContext);
  const [movies, setMovies] = useState([]);

  const params = useParams();

  const userId = params.userId;

  var accessToken;


  function topThreeMovies(){
    console.log("FAV MOVIES");
    console.log(userContext.details.favorite_movies);
    if(Object.entries(userContext.details.favorite_movies).length > 0){
      var movieRanks = Object.keys(userContext.details.favorite_movies);
      var topThreeMoviesArray = [];
      for(var i = 0; i < Math.min(movieRanks.length,3); i++){
        var currentMovie = userContext.details.favorite_movies[movieRanks[i]];
        //Make a movie card for each and push
        var movieImage = currentMovie.poster_path ? "https://image.tmdb.org/t/p/w185/" + currentMovie.poster_path : "./NoMovieImage.jpg"

          topThreeMoviesArray.push(<MovieCard movie={{currentMovie,"image":movieImage,"movieAlreadyAdded":true}}/>);

        //topThreeMoviesArray.push(userContext.details.favorite_movies[movieRanks[i]]);
      }
      //var sortedFavMovies = new Map([...userContext.details.favorite_movies].sort());
      console.log(topThreeMoviesArray);

      return(topThreeMoviesArray);
    }
  }

  function topOneHundredMovies(){
    if(Object.entries(userContext.details.favorite_movies).length > 0){
      var movieRanks = Object.keys(userContext.details.favorite_movies);
      var favoriteMovies = [];
      for(var i = 0; i < movieRanks.length; i++){
        var currentMovie = userContext.details.favorite_movies[movieRanks[i]];
        //Make a movie card for each and push
        var movieImage = currentMovie.poster_path ? "https://image.tmdb.org/t/p/w185/" + currentMovie.poster_path : "./NoMovieImage.jpg"

          favoriteMovies.push(<MovieCard movie={{currentMovie,"image":movieImage,"movieAlreadyAdded":true}}/>);

        //topThreeMoviesArray.push(userContext.details.favorite_movies[movieRanks[i]]);
      }
      //var sortedFavMovies = new Map([...userContext.details.favorite_movies].sort());
      console.log(favoriteMovies);

      return(favoriteMovies);
    }
  }

  return userContext.details == null ? (
    <div className="container mt-3">
      <div className="alert alert-danger">Please login to view your profile.</div>
    </div>) :
    (
      <div className="container mt-3">
        <div className="row">
          <div className="col-lg-4">
            <h1>Email: {userContext.details.email}</h1>
            <h3>Movies Favorited: {Object.entries(userContext.details.favorite_movies).length}</h3>
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

export default Profile;
