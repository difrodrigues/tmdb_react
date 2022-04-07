import * as React from "react";
import { Component } from "react";
import { Movie } from "../App";
import imagePlaceholder from "../assets/placeholder-image.jpg";
import "./MovieCard.css";

interface MovieCardProps {
  movie: Movie;
}

interface MovieCardState {}

class MovieCard extends Component<MovieCardProps, MovieCardState> {
  state = {};

  render() {
    const { image, title, year } = this.props.movie;
    const imageUrl = image ?? imagePlaceholder;

    return (
      <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-xs-12 mb-3">
        <div className="card">
          <img src={imageUrl} className="card-img-top image"></img>
          <div className="card-body">
            <h5 className="card-title text-truncate text-truncate-sm" title={title}>{title}</h5>
            <p className="card-text">{year}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default MovieCard;
