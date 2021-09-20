import React, { useState } from "react";
import { Link } from "react-router-dom";

const ProfileCard = props => {
  return (
    <div className="card border embbed-responsive" style={{width: "18rem"}}>
      <div className="card-body">
        <h3 className="card-title">Email: {props.profile.email}</h3>
        <h5 className="card-text">Movies Favorited: {props.profile.favorite_movies_length}</h5>
        <h5 className="card-text">Favorite Movie: {props.profile.favorite_movie}</h5>
        <div className="row">
          <Link className="btn btn-primary" to={"/profile/" + props.profile._id}>Visit</Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
