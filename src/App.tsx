import axios from "axios";
import { Component } from "react";
import "./App.css";

interface Movie {
  id: number;
  title: string;
  year: string;
  image: string;
}

interface AppProps {}

interface AppState {
  movies: Movie[];
}

class App extends Component<AppProps, AppState> {
  state = {
    movies: []
  };

  render() {
    return (
      <div className="row">
        <h4 className="col m-2 text-center">The Movie DB</h4>
      </div>
    );
  }

  componentDidMount() {
    // axios.get()
  }
}

export default App;
