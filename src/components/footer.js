import React, { useState } from "react";
import { Link } from "react-router-dom";
import 'font-awesome/css/font-awesome.min.css';

const Footer = props => {
  return (
    <footer className="text-center text-lg-start bg-dark text-light">
      <div className="container p-4 pb-0">
        <section className="">
          <div className="row">
            <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
              <h5 className="text-uppercase text-center">Top 100 Movies</h5>

              <p>
                I wanted to create a website where you can compile your favorite movies.
                Feel free to take a look at my code and use it in your own projects.
                I hope you enjoy. If you have any questions, please reach out!
              </p>
            </div>
            <div className="col-lg-4 col-md-10 mb-4 mb-md-0">
              <h5 className="text-uppercase text-center">Credits</h5>
              <p className="">This product uses the TMDB API but is not endorsed or certified by <a href="www.themoviedb.org" >TMDB</a></p>
              <img src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_1-5bdc75aaebeb75dc7ae79426ddd9be3b2be1e342510f8202baf6bffa71d7f5c4.svg" class="w-25 mx-auto d-block"/>
            </div>
            <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
              <h5 className="text-uppercase text-center">Contact Me</h5>

              <ul className="list-unstyled mb-0">
                <li>
                  <p> Email: <a className="fa fa-lg fa-envelope" href="mailto:joshua@joshuawilliamson.net"></a></p>
                </li>
                <li>
                  <p> Github: <a className="fa fa-lg fa-github" href="https://github.com/jwilliamson13-tech"></a></p>
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>
      <div className="text-center p-3">
        <div className="fa fa-copyright"></div> 2021 Joshua Williamson: <a  href="https://opensource.org/licenses/MIT">MIT LICENSE</a>
      </div>
    </footer>
  );
};

export default Footer;
