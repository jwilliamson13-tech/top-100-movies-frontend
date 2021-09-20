import React, { useState, useContext, useEffect, useCallback} from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const MovieCard = props => {

  const history = useHistory();

  const[rank,setRank] = useState();
  const [userContext, setUserContext] = useContext(UserContext);
  const [error, setError] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [rankInput, setRankInput] = useState("");
  const [movieAdded, setMovieAdded] = useState(props.movie.movieAlreadyAdded);
  var errorMessage = "Error with movies. Please try again later.";
  //var movieAdded = props.movie.movieAlreadyAdded;

  useEffect(()=>{
      //Get User Details

      //Redirect if not logged in
      //console.log("MOVIE ADDED?");
      //console.log(props.movie.movieAlreadyAdded);
      //Set the state of the button based on movie added or not
      if(props.movie.movieAlreadyAdded){
        setButtonText("Delete Movie");
        setRankInput("");
      }
      else{
        setButtonText("Add Movie");
        setRankInput("<div className=\"col-sm-5\"><input type=\"text\" className=\"form-control\" placeholder=\"Rank\" value={rank} onChange={onChangeRank}></input></div>");
      }
    }, [props.movie.movieAlreadyAdded]);

  function isNumeric(str) {
    if (typeof str != "string"){
      return false
    }
    return !isNaN(str) && !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  };

  const onChangeRank = e => {
      var newRank = e.target.value;
      if((newRank > 100 || newRank < 1) && newRank){
        newRank = "";
      }
      if(!isNumeric(rank) && rank){
        newRank = "";
      }
      setRank(newRank);
  };

  function addMovie(){
    var errorMessage = "Error with movies. Please try again later.";
    //Check if rank is within range and not null and user id
    if(rank <= 100 && rank >= 1 && rank && userContext.details._id){
      fetch(process.env.REACT_APP_API_ENDPOINT+ "api/v1/movies", {
        method: "POST",
        credentials: "include",
        headers:{"Content-Type":"application/json", Authorization: `Bearer ${userContext.token}`},
        body: JSON.stringify({id:userContext.details._id,movie:props.movie.currentMovie,rank:rank})
      })
      .then(async response => {
        if(!response.ok){
          if(response.status === 400){
            setError("Please fill out all fields correctly.");
          }
          else if(response.status === 401){
            setError("Not signed in. Please sign in to add movies.");
          }
          else {
            setError(errorMessage);
          }
        }
        else{
          const data = await response.json();
          if(data.success){
            setMovieAdded(true);
            setButtonText("Delete Movie");
            //fetchUserDetails();
            //This had an antiquated setRank, but for some reason, the 3rd setState here would not re-render. So whatever was 3rd was left out of the frontend so to speak. This is where the movie added "bug" came in.
          }
        }
      })
      .catch(e =>{
        setError(errorMessage);
      })
    }
  }

  function deleteMovie(){
    var errorMessage = "Error deleting movie. Please try again later.";
    console.log("DELETING");
    fetch(process.env.REACT_APP_API_ENDPOINT+ "api/v1/movies", {
      method: "DELETE",
      credentials: "include",
      headers:{"Content-Type":"application/json", Authorization: `Bearer ${userContext.token}`},
      body: JSON.stringify({id:userContext.details._id,movie:props.movie.currentMovie})
    })
    .then(async response => {
      if(!response.ok){
        if(response.status === 400){
          setError("Error");
        }
        else if(response.status === 401){
          setError("Not signed in. Please sign in to add movies.");
        }
        else {
          setError(errorMessage);
        }
      }
      else{
        const data = await response.json();
        if(data.success){
          setMovieAdded(false);
          setButtonText("Add Movie");
          //fetchUserDetails();
          //This had an antiquated setRank, but for some reason, the 3rd setState here would not re-render. So whatever was 3rd was left out of the frontend so to speak. This is where the movie added "bug" came in.
        }
      }
    })
    .catch(e =>{
      setError(errorMessage);
    })
  }

  function buttonController(){
    if(buttonText == "Add Movie"){
      addMovie();
    }
    if(buttonText == "Delete Movie"){
      deleteMovie();
    }
  }

  function rankInputFunc2(){
    return rankInput;
  }


  function rankInputFunc(){
    if(!movieAdded){
      return(
        <div className="col-sm-5">
          <input type="text" className="form-control" placeholder="Rank" value={rank} onChange={onChangeRank}></input>
        </div>
      )
    }
  }


  return (
    <div className="card border embbed-responsive" style={{width: "18rem"}}>
      <div className="card-body">
        <img className="card-img" src={props.movie.image}/>
        <h5 className="card-title">{props.movie.currentMovie.original_title}</h5>
        <p className="card-text">{props.movie.currentMovie.overview}</p>
        <div className="row">
        {
          !movieAdded ? (<div className="col-sm-5">
            <input type="text" className="form-control" placeholder="Rank" value={rank} onChange={onChangeRank}></input>
          </div>)
          : (<div></div>)
        }


        <div className="col-sm-7">
          <button className="btn btn-outline-secondary" type="button" onClick={buttonController}>{buttonText}</button>
        </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
