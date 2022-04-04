import axios from "axios";
import "primeicons/primeicons.css"; //icons
import { InputText } from "primereact/inputtext";
import "primereact/resources/primereact.min.css"; //core css
import "primereact/resources/themes/mdc-dark-indigo/theme.css"; //theme
import { ChangeEvent, Component } from "react";
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

interface AppProps {}

interface AppState {
  // movies: Movie[];
}
//#endregion

const BASE_API_URL = "https://api.themoviedb.org/3";
const SEARCH_URL = "search/movie";
const CONFIG_URL = "configuration";
const API_KEY = "api_key=b3f55574834a697708239742b7555490";

class App extends Component<AppProps, AppState> {
  state = {
    imageBaseUrl: "",
    posterSize: "",
    movies: [],
    searchString: "",
  };

  get configUrl() {
    return `${BASE_API_URL}/${CONFIG_URL}?${API_KEY}`;
  }

  get searchUrl() {
    return `${BASE_API_URL}/${SEARCH_URL}?${API_KEY}`;
  }

  render() {
    return (
      <div className="app row m-0">
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

        {this.parseMovies()}
      </div>
    );
  }

  parseMovies() {
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

  handleDataResponse(res: ApiResponse) {
    if (res.status === 200) {
      const moviesSearch = (res.data as SearchMovieData).results;
      const movies: Movie[] = [];
      const { imageBaseUrl, posterSize } = this.state;

      moviesSearch.map((m) =>
        movies.push({
          id: m.id,
          title: m.title,
          year: m.release_date.substring(0, 4),
          image: m.poster_path
            ? `${imageBaseUrl}${posterSize}${m.poster_path}`
            : null,
        })
      );

      this.setState({ movies });
    }
  }

  handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const searchString = event.target.value;
    this.setState({ searchString });

    if (!!searchString)
      axios
        .get(`${this.searchUrl}&query=${searchString}`)
        .then((res) => this.handleDataResponse(res))
        .catch((err) => console.log(err));
    else this.setState({ movies: [] });
  };
}

export default App;
