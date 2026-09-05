import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RatingInput } from "./RatingInput";
import { useRating } from "../hooks/useRating";
import type { MovieDetail } from "@/features/movie/types/movieDetail.types";

vi.mock("../hooks/useRating", () => ({
  useRating: vi.fn(),
}));

const mockMovie: MovieDetail = {
  id: 157336,
  title: "Interstellar",
  posterUrl: null,
  voteAverage: 8.6,
  releaseYear: 2014,
  overview: "A team travels through a wormhole.",
  backdropUrl: null,
  runtime: 169,
  genres: [],
  tagline: null,
  cast: [],
  director: null,
  writers: [],
  trailerUrl: null,
  watchProviders: [],
  watchProvidersLink: null,
  isFavourite: false,
  userRating: null,
};

const expectedSnapshot = {
  movieId: 157336,
  title: "Interstellar",
  posterUrl: null,
  voteAverage: 8.6,
  releaseYear: 2014,
};

describe("RatingInput", () => {
  const rateMovie = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    rateMovie.mockResolvedValue(undefined);
    vi.mocked(useRating).mockReturnValue({
      rateMovie,
      isLoading: false,
      error: null,
    });
  });

  // Scenario: No rating yet
  //   Given the movie has no rating
  //   When the component renders
  //   Then no score text should be shown
  it("shows no score text when userRating is null", () => {
    render(<RatingInput movie={mockMovie} />);

    expect(screen.queryByText(/\/10/)).not.toBeInTheDocument();
  });

  // Scenario: Existing rating is displayed
  //   Given the movie already has a rating of 6
  //   When the component renders
  //   Then it should show "6/10"
  it("shows the current rating as text", () => {
    render(<RatingInput movie={{ ...mockMovie, userRating: 6 }} />);

    expect(screen.getByText("6/10")).toBeInTheDocument();
  });

  // Scenario: Click the right half of a star calls rateMovie with an even value
  //   Given no rating yet
  //   When I click the right half of the 3rd star
  //   Then rateMovie should be called with the movie snapshot and 6 (3 * 2)
  it("calls rateMovie with an even value when clicking the right half of a star", async () => {
    const user = userEvent.setup();

    render(<RatingInput movie={mockMovie} />);

    const button = screen.getByLabelText("Puntuar con 6 de 10");
    await user.click(button);

    expect(rateMovie).toHaveBeenCalledWith(expectedSnapshot, 6);
  });

  // Scenario: Click the left half of a star calls rateMovie with an odd value
  //   Given no rating yet
  //   When I click the left half of the 3rd star
  //   Then rateMovie should be called with the movie snapshot and 5 (3 * 2 - 1)
  it("calls rateMovie with an odd value when clicking the left half of a star", async () => {
    const user = userEvent.setup();

    render(<RatingInput movie={mockMovie} />);

    const button = screen.getByLabelText("Puntuar con 5 de 10");
    await user.click(button);

    expect(rateMovie).toHaveBeenCalledWith(expectedSnapshot, 5);
  });

  // Scenario: Hovering previews the rating without calling rateMovie
  //   Given no rating yet
  //   When I hover over the 4th star's right half
  //   Then the preview text should show "8/10" without rateMovie being called
  it("previews the rating on hover without calling rateMovie", async () => {
    const user = userEvent.setup();

    render(<RatingInput movie={mockMovie} />);

    const button = screen.getByLabelText("Puntuar con 8 de 10");
    await user.hover(button);

    expect(screen.getByText("8/10")).toBeInTheDocument();
    expect(rateMovie).not.toHaveBeenCalled();
  });

  // Scenario: Mouse leaving the group reverts to the real value
  //   Given a confirmed rating of 4
  //   When I hover over a different star and then leave
  //   Then the display should revert to "4/10"
  it("reverts to the real value after the mouse leaves", async () => {
    const user = userEvent.setup();

    render(<RatingInput movie={{ ...mockMovie, userRating: 4 }} />);

    const button = screen.getByLabelText("Puntuar con 8 de 10");
    await user.hover(button);
    expect(screen.getByText("8/10")).toBeInTheDocument();

    await user.unhover(button);
    expect(screen.getByText("4/10")).toBeInTheDocument();
  });

  // Scenario: Rating fails and reverts to the previous value
  //   Given a confirmed rating of 4
  //   When I click a new rating and the request fails
  //   Then the display should revert to the previous rating
  it("reverts to the previous rating if the request fails", async () => {
    rateMovie.mockRejectedValueOnce(new Error("Network error"));
    const user = userEvent.setup();

    render(<RatingInput movie={{ ...mockMovie, userRating: 4 }} />);

    const button = screen.getByLabelText("Puntuar con 8 de 10");
    await user.click(button);

    expect(await screen.findByText("4/10")).toBeInTheDocument();
  });
});
