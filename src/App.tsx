import axios from "axios";
import "primeicons/primeicons.css"; //icons
import { InputText } from "primereact/inputtext";
import "primereact/resources/primereact.min.css"; //core css
import "primereact/resources/themes/mdc-dark-indigo/theme.css"; //theme
import { ChangeEvent, Component, UIEvent } from "react";
import "./App.css";
import MovieCard from "./movie-card/MovieCard";

//#region Interfaces
export interface Movie {
  id: number;
  title: string;
  year: string;
  image: string | null;
}

interface ApiResponse {
  status: number;
  data: ConfigData | SearchMovieData;
}

interface ConfigData {
  images: {
    secure_base_url: string;
    poster_sizes: string[];
  };
}

interface SearchMovieData {
  page: number;
  results: MovieSearch[];
}

interface MovieSearch {
  adult: boolean;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}
//#endregion

const BASE_API_URL = "https://api.themoviedb.org/3";
const SEARCH_URL = "search/movie";
const CONFIG_URL = "configuration";
const API_KEY = "api_key=b3f55574834a697708239742b7555490";

class App extends Component {
  state = {
    imageBaseUrl: "",
    posterSize: "",
    movies: [],
    searchString: "",
    page: 1,
    lastPage: false,
    loadingMovies: false
  };

  get configUrl() {
    return `${BASE_API_URL}/${CONFIG_URL}?${API_KEY}`;
  }

  get searchUrl() {
    return `${BASE_API_URL}/${SEARCH_URL}?${API_KEY}`;
  }

  render() {
    return (
      <div className="app" onScroll={this.handleScroll}>
        <div className="row m-0">
          <h1 className="col-12 mt-2 mb-2 text-center text-white">The Movie DB</h1>
          <div className="p-fluid col-lg-4 col-md-6 col-sm-12 m-2">
            <div className="field col-12 md:col-4">
              <span className="p-float-label p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                  id="search"
                  value={this.state.searchString}
                  onChange={this.handleSearchChange}
                />
                <label htmlFor="search">Search for a movie...</label>
              </span>
            </div>
          </div>

          {this.renderMovies()}
          
          {this.state.loadingMovies && <span>Loading more movies...</span>}
        </div>
      </div>
    );
  }

  renderMovies() {
    const { searchString, movies } = this.state;

    // if (!searchString) return <span>Waiting for user input...</span>;

    if (!!searchString) {
      if (!movies.length) return <span className="text-white">No movies found!</span>;
      else
        return (
          <div className="row m-0">
            {this.state.movies.map((movie: Movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
          // <div>
          //   {this.state.movies.map((movie: Movie) => (
          //     <div key={movie.id}>
          //       <pre>{JSON.stringify(movie, null, 2)}</pre>
          //     </div>
          //   ))}
          // </div>
        );
    }
  }

  componentDidMount() {
    axios.get(this.configUrl).then((res) => this.handleConfigResponse(res));
  }

  handleConfigResponse(res: ApiResponse) {
    if (res.status === 200) {
      const imagesConfig = (res.data as ConfigData).images;
      const imageBaseUrl = imagesConfig.secure_base_url;
      const posterSize =
        imagesConfig.poster_sizes[imagesConfig.poster_sizes.length - 4];

      this.setState({ imageBaseUrl, posterSize });
    }
  }

  handleDataResponse(res: ApiResponse, appendToMovies: boolean) {
    if (res.status === 200) {
      const moviesSearch = (res.data as SearchMovieData).results;
      const movies: Movie[] = appendToMovies ? this.state.movies : [];
      const { imageBaseUrl, posterSize } = this.state;
      let { page, lastPage, loadingMovies } = this.state;

      if (moviesSearch.length) {
        moviesSearch.map((m) =>
          movies.push({
            id: m.id,
            title: m.title,
            year: m.release_date ? m.release_date.substring(0, 4) : "Unknown",
            image: m.poster_path
              ? `${imageBaseUrl}${posterSize}${m.poster_path}`
              : null,
          })
        );

        page++;
      } else lastPage = true;

      loadingMovies = false;

      this.setState({ movies, page, lastPage, loadingMovies });
    }
  }

  handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchString: event.target.value, page: 1 }, () => this.getMovies(false));
  };

  getMovies(appendToMovies: boolean) {
    const { searchString, page } = this.state;

    if (!!searchString)
      axios
        .get(`${this.searchUrl}&query=${searchString}&page=${page}`)
        .then((res) => this.handleDataResponse(res, appendToMovies))
        .catch((err) => console.log(err));
    else this.setState({ movies: [] });
  }

  handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const { clientHeight, scrollHeight, scrollTop } = event.currentTarget;
    const bottom = scrollHeight - scrollTop === clientHeight;
    if (bottom) {
      this.setState({ loadingMovies: true }, () => this.getMovies(true));
    };
  }
}

export default App;
