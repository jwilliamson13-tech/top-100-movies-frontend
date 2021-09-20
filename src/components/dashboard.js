import React, { useState, useContext, useEffect} from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import MovieCard from "../components/movieCard";


const Dashboard = props => {
  const [userContext, setUserContext] = useContext(UserContext);
  const [followingMovies, setFollowingMovies] = useState([]);

  const bgImageStyle = {
    backgroundImage: 'url(\'\https://images.unsplash.com/photo-1592780828756-c418d71faa1f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80\')',
    height: "40vh"
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


  function showFollowingMovies(){
    var followsMovies = [];
    if(userContext.details != null){
      //Get followers
      var follows = userContext.details.following;

      //Loop through followers and get data
      for(var i = 0; i < follows.length; i++){
        //Look at top 3 movies from followers
        fetch(process.env.REACT_APP_API_ENDPOINT +"users/"+follows[i], {
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
            if(Object.entries(data.favorite_movies).length > 0){
              var movieRanks = Object.keys(data.favorite_movies);
              var movieCount = 0;

              for(var j = 0; j < Math.min(movieRanks.length,3); j++){
                var currentMovie = data.favorite_movies[movieRanks[j]];
                //Make a movie card for each and push
                var movieImage = currentMovie.poster_path ? "https://image.tmdb.org/t/p/w185/" + currentMovie.poster_path : "./NoMovieImage.jpg"
                followsMovies.push(<MovieCard movie={{currentMovie,"image":movieImage,"movieAlreadyAdded":movieInUserFavorites(currentMovie.id)}}/>);
              }
            }
            console.log("FOLLOWS MOVIES");
            console.log(Object.entries(followsMovies)[1][1]);
            return(Object.entries(followsMovies)[1][1]);
          }
          else{
            if(response.status === 401){
              console.log("COULDNT FETCH PROFILE DETAILS");
              //window.location.reload()
            }
          }
        })
      }
    }
  }

  function followingMoviesShow(){
    if(userContext.details != null){
      //Look at top 3 movies from followers
      fetch(process.env.REACT_APP_API_ENDPOINT +"users/following/movies", {
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
          console.log("DATA");
          console.log(data.data);
          setFollowingMovies(data.data);
        }
      })
    }
  }

  //Write a function to compare movies ID
  function areSameMovie(firstMovie, secondMovie){
    if(firstMovie.id == secondMovie.id){
      return true;
    }
    else{
      return false;
    }
  }

  useEffect(() =>{
    console.log("CONTEXT");
    console.log(userContext);
    if(userContext){
      followingMoviesShow()
    }
  },[userContext])

  return (
    <div className="contianer-fluid rounded">
      <div className="container  bg-image pt-5" style={bgImageStyle}>
        <h1 className=" text-light rounded">Welcome to Top 100 Movies</h1>
        <h3 className="text-light pb-5 pt-3">This is a place where you can rank your top 100 movies.</h3>
      </div>
      {
        userContext.details == null ? (

            <div className="row mt-5 mb-3 rounded justify-content-center align-items-center">
              <div className="col-md-6 text-center">
                <p>Already have an account?</p>
                <Link className="btn btn-primary" to="/login">Login</Link>
              </div>
              <div className="col-md-6 text-center">
                <p>New here?</p>
                <Link className="btn btn-primary" to="/register">Register</Link>
              </div>
            </div>
        )
        :
        (
          <div className="row mt-3">
            <h3 className="text-center">People You Follow Like These Movies</h3>
            {
              followingMovies.map(currentMovie => {
                var movieImage = currentMovie.poster_path ? "https://image.tmdb.org/t/p/w185/" + currentMovie.poster_path : "./NoMovieImage.jpg"
                var movieAlreadyAdded;
                //Determine if movie is already added
                if(Object.entries(userContext.details.favorite_movies).length < 1){
                  movieAlreadyAdded = false;
                }
                else{
                  //movieAlreadyAdded = false;
                  for(var i = 0; i < Object.entries(userContext.details.favorite_movies).length; i++){
                    if(areSameMovie(currentMovie,Object.entries(userContext.details.favorite_movies)[i][1])){
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
            }
          </div>
        )
      }
      </div>
  )
};

export default Dashboard;
