import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import App from "./App";

// jest.mock("axios");

describe("App", () => {
  // Unit tests
  test("renders The Movie DB title", () => {
    render(<App />);
    // screen.debug();

    expect(screen.getByText(/The Movie DB/));
  });

  // Integrations tests
  test("search for Bohemian movie", async () => {
    // const movies = [
    //   { id: "1", title: "Bohemian Rhapsody", year: "2018" },
    //   { id: "2", title: "The Story of Bohemian Rhapsody", year: "2004" }
    // ];
    // const handleSearchChange = jest.fn();

    // render(<App />);

    // await userEvent.type(screen.getByRole("textbox"), "Bohemian");

    // expect(handleSearchChange).toHaveBeenCalledTimes(8);

    // (axios.get as jest.Mock).mockImplementationOnce(() =>
    //   Promise.resolve({ data: { movies } })
    // );

    // screen.debug();
  });
});
