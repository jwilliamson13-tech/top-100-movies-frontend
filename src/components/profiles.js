import React, { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import DataService from "../services/userDataService";
import ProfileCard from "./profileCard"

const Profiles = props => {

  const [profiles, setProfiles] = useState([]);
  const [searchName, setSearchName ] = useState("");

  useEffect(()=>{
      retrieveUsers();
    }, []);

  const onChangeSearchName = e => {
      const searchName = e.target.value;
      setSearchName(searchName);
  };

  const retrieveUsers = () => {
      DataService.getUsers()
      .then(response => {
        setProfiles(response.data); //Gonna have to change this to match data received
      })
    };

  const retrieveUser = (searchName) => {
    //Do this to reset currentFilter
    if(searchName.length == 0){
      retrieveUsers();
    }
    else{
      var filteredUsers = profiles.filter(user => user.email.toLowerCase().includes(searchName.toLowerCase()));
      setProfiles(filteredUsers);
    }
  };

  //Setup search bar working on enter press
  function keyHandler(e){
    if(e.code == "Enter"){
      retrieveUser(searchName);
    }
  }

  return (
    <div className="container pr-5 pl-5">
      <h1 className="text-center">Search for Profiles</h1>
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
              onClick={() => retrieveUser(searchName)}
              //Need to add on click event and state event here
            >
              Search
            </button>
          </div>
        </div>
      </div>
      <div className="row pt-3 pb-3 justify-content-center">
        {
          profiles.map(currentProfile => {
            console.log("PROFILE");
            console.log(currentProfile.favorite_movies);
            var favorite_movie = "";
            if(Object.entries(currentProfile.favorite_movies).length > 0){
              var movieKeys = Object.keys(currentProfile.favorite_movies).sort();
              favorite_movie = currentProfile.favorite_movies[movieKeys[0]].original_title //Have to change this if using a map
            }
            else{
              favorite_movie = "NONE"
            }
            return(
              <ProfileCard profile={{"email":currentProfile.email, "favorite_movies_length":Object.entries(currentProfile.favorite_movies).length, "favorite_movie":favorite_movie, "_id":currentProfile._id}}/>
            )
          })
        }
      </div>
    </div>
  );
};


/*
{
  movies.map(currentMovie => {
    var movieImage = currentMovie.poster_path ? "https://image.tmdb.org/t/p/w185/" + currentMovie.poster_path : "./NoMovieImage.jpg"
    return(
      <MovieCard movie={{"name":currentMovie.original_title, "description":currentMovie.overview, "image":movieImage}}/>
    )
  })
}
*/
//{movies.map((movies) =>{
//<MovieCard movie={{"name":"Mean Girls","description":"Girls are mean. I don't know what you expected.","image":"https://image.tmdb.org/t/p/w185/fXm3YKXAEjx7d2tIWDg9TfRZtsU.jpg"}}/>
//<MovieCard movie={{"name":"Toy Story","description":"Toys do some crazy shit on this wild ass adventure. Be prepared to be scared because the neighbor kid is batshit, and you'll think your own toys may come to life to kill you one day. Pick up your phobia of dolls and toys with eyes now!!!","image":"https://image.tmdb.org/t/p/w185/uXDfjJbdP4ijW5hWSBrPrlKpxab.jpg"}}/>
//<MovieCard movie={{"name":"Mean Girls","description":"Girls are mean. I don't know what you expected.","image":"https://image.tmdb.org/t/p/w185/xj3jhyq3ZsfdVn79kXC1XKFVQlv.jpg"}}/>
//}};

export default Profiles;
