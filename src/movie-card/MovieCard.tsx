import * as React from "react";
import { Component } from "react";
import { Movie } from "../App";

interface MovieCardProps {
  movie: Movie;
}

interface MovieCardState {}

class MovieCard extends Component<MovieCardProps, MovieCardState> {
  state = {};

  render() {
    const { image, title, year } = this.props.movie;

    return (
      <div className="card col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12">
        <img src={image} className="card-img-top"></img>
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <p className="card-text">{year}</p>
        </div>
      </div>
    );
  }
}

export default MovieCard;
