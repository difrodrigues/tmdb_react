import { render, screen } from "@testing-library/react";
import { Movie } from "../App";
import MovieCard from "./MovieCard";

describe("MovieCard", () => {
  test("renders a movie card", () => {
    const movie: Movie = { id: 1, title: "Bohemian Rhapsody", year: "2018", image: null };
    render(<MovieCard movie={movie}/>);
    // screen.debug();
    
    // Asserts on image
    const image = screen.getByRole("img");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "placeholder-image.jpg");

    // Asserts on title
    const title = screen.getByRole("heading");
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(movie.title);

    // Asserts on year
    const year = screen.getByText("2018");
    expect(year).toBeInTheDocument();
    expect(year).toHaveTextContent(movie.year);
  });
});
