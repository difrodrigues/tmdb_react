import axios from "axios";
import { ChangeEvent, Component } from "react";
import "./App.css";

interface Movie {
  id: number;
  title: string;
  year: string;
  image: string;
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
      <div className="row">
        <h4 className="col m-2 text-center">The Movie DB</h4>
        <form>
          <div className="col-4 m-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search for a movie..."
              onChange={this.handleSearchChange}
            />
          </div>
        </form>
        {this.parseMovies()}
      </div>
    );
  }

  parseMovies() {
    return (
      <div>
        {this.state.movies.map((movie: Movie) => (
          <div key={movie.id}>
            <pre>{JSON.stringify(movie, null, 2)}</pre>
          </div>
        ))}
      </div>
    );
  }

  componentDidMount() {
    axios.get(this.configUrl).then((res) => this.handleConfigResponse(res));
  }

  handleConfigResponse(res: ApiResponse) {
    if (res.status === 200) {
      const imagesConfig = (res.data as ConfigData).images;
      const imageBaseUrl = imagesConfig.secure_base_url;
      const posterSize = imagesConfig.poster_sizes[0];

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
          image: `${imageBaseUrl}${posterSize}${m.poster_path}`,
        })
      );

      this.setState({ movies });
    }
  }

  handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const input = event.target.value;

    axios
      .get(`${this.searchUrl}&query=${input}`)
      .then((res) => this.handleDataResponse(res))
      .catch((err) => console.log(err));
  }
}

export default App;
