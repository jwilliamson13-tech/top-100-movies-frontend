import React, { useState,useEffect, useContext, useCallback } from "react";
import { Link } from "react-router-dom";
import MovieCard from "../components/movieCard";
import MoviesDataService from "../services/dataService";
import { UserContext } from "../context/UserContext";

const Movies = props => {
  const [userContext, setUserContext] = useContext(UserContext);
  const [oldUserContext, setOldUserContext] = useState("");
  const [movies, setMovies] = useState([]);
  const [userMoviesArray, setUserMoviesArray] = useState([]);
  const [searchName, setSearchName ] = useState("");
  const [loadedUser, setLoadedUser ] = useState(false);
  const [isLoading, setIsLoading] = useState();

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
          //window.location.reload()
        }
        else{
          setUserContext(oldUserValues => {
            return {...oldUserValues, details:null};
          });
        }
      }
    })
  });

  useEffect(() => {
    //fetchUserDetails();
  },[]);





  const onChangeSearchName = e => {
      const searchName = e.target.value;
      setSearchName(searchName);
  };

  const retrieveMovies = (searchName) => {
      setIsLoading(true);
      MoviesDataService.getMovies(searchName)
      .then(response => {
        if(Object.entries(userContext.details.favorite_movies).length >= 1){
          setUserMoviesArray(Object.entries(userContext.details.favorite_movies));
        }
        setMovies(response.data.data.results); //Gonna have to change this to match data received
        setIsLoading(false);
      })
    };

    //Write a function to compare movies ID
    function areSameMovie(firstMovie, secondMovie){
      if(firstMovie.id == secondMovie.id){
        return true;
      }
      else{
        return false;
      }
    }

    //Setup search bar working on enter press
    function keyHandler(e){
      if(e.code == "Enter"){
        retrieveMovies(searchName);
      }
    }


  return (
    <div className="container pr-5 pl-5">
      <h1 className="text-center">Search for Movies</h1>
      <div className="row pb-1">
        <div className="input-group col-lg-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name"
            value={searchName}
            onChange={onChangeSearchName}
            onKeyUp={keyHandler}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={() => retrieveMovies(searchName)}
              //Need to add on click event and state event here
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="row pt-3 pb-3 justify-content-center">
          {
            isLoading ? (
              <h1 className="text-center">LOADING MOVIES</h1>
            )
            :
            (
              movies.map(currentMovie => {
                var movieImage = currentMovie.poster_path ? "https://image.tmdb.org/t/p/w185/" + currentMovie.poster_path : "./NoMovieImage.jpg"
                var movieAlreadyAdded;
                //Determine if movie is already added
                if(userMoviesArray.length < 1){
                  movieAlreadyAdded = false;
                }
                else{
                  //movieAlreadyAdded = false;
                  for(var i = 0; i < userMoviesArray.length; i++){
                    if(areSameMovie(currentMovie,userMoviesArray[i][1])){
                      movieAlreadyAdded = true;
                      break;
                    }
                    else{
                      movieAlreadyAdded = false;
                    }
                  }
                  /*
                  console.log(currentMovie);
                  //console.log(userContext.details.favorite_movies);
                  console.log(Array.from(Object.entries(userContext.details.favorite_movies)));
                  movieAlreadyAdded = Array.from(Object.entries(userContext.details.favorite_movies)).includes(currentMovie);
                  */
                }

                return(
                  <MovieCard movie={{currentMovie,"image":movieImage,"movieAlreadyAdded":movieAlreadyAdded}}/>
                )
              })
            )
          }
      </div>
    </div>
  );
};

export default Movies;
