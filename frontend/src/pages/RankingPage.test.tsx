import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import RankingPage from "./RankingPage";
import { useRanking } from "@/features/stats/hooks/useRanking";

vi.mock("@/features/stats/hooks/useRanking", () => ({
  useRanking: vi.fn(),
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <RankingPage />
    </MemoryRouter>,
  );
}

const mockRanking = [
  {
    id: 1,
    title: "Interstellar",
    posterUrl: null,
    releaseYear: 2014,
    voteAverage: 8.6,
    averageRating: 9.2,
    ratingCount: 15,
  },
  {
    id: 2,
    title: "Fight Club",
    posterUrl: null,
    releaseYear: 1999,
    voteAverage: 8.4,
    averageRating: 8.5,
    ratingCount: 10,
  },
];

describe("RankingPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Scenario: Show loading indicator while data is being fetched
  //   Given I navigate to the ranking page
  //   When the data is still loading
  //   Then I should see a "Cargando..." indicator
  it("shows loading state", () => {
    vi.mocked(useRanking).mockReturnValue({
      ranking: [],
      isLoading: true,
      error: null,
    });

    renderPage();

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  // Scenario: Show an error message if the request fails
  //   Given I navigate to the ranking page
  //   When an error occurs while fetching the data
  //   Then I should see an error message
  it("shows error state", () => {
    vi.mocked(useRanking).mockReturnValue({
      ranking: [],
      isLoading: false,
      error: "Network error",
    });

    renderPage();

    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  // Scenario: Render all ranked movies with their position
  //   Given the ranking has multiple movies
  //   When the page loads
  //   Then each movie should show its position, title, and average rating
  it("renders all ranked movies with position, title, and average rating", () => {
    vi.mocked(useRanking).mockReturnValue({
      ranking: mockRanking,
      isLoading: false,
      error: null,
    });

    renderPage();

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("Interstellar")).toBeInTheDocument();
    expect(screen.getByText("9.2")).toBeInTheDocument();

    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("Fight Club")).toBeInTheDocument();
    expect(screen.getByText("8.5")).toBeInTheDocument();
  });

  // Scenario: Show the number of ratings received
  //   Given a movie has received 15 ratings
  //   When the page loads
  //   Then "15 votos" should be visible
  it("shows the number of ratings received", () => {
    vi.mocked(useRanking).mockReturnValue({
      ranking: mockRanking,
      isLoading: false,
      error: null,
    });

    renderPage();

    expect(screen.getByText("15 votos")).toBeInTheDocument();
    expect(screen.getByText("10 votos")).toBeInTheDocument();
  });

  // Scenario: Movies are displayed in the order provided by the backend (already sorted)
  //   Given the backend returns movies sorted by average rating, descending
  //   When the page renders
  //   Then the movies should appear in that same order
  it("renders movies in the order provided by the backend", () => {
    vi.mocked(useRanking).mockReturnValue({
      ranking: mockRanking,
      isLoading: false,
      error: null,
    });

    renderPage();

    const titles = screen.getAllByText(/Interstellar|Fight Club/);
    expect(titles[0]).toHaveTextContent("Interstellar");
    expect(titles[1]).toHaveTextContent("Fight Club");
  });

  // Scenario: Each row links to the movie's detail page
  //   Given the ranking has a movie
  //   When the page renders
  //   Then clicking it should link to /pelicula/:id
  it("links each movie to its detail page", () => {
    vi.mocked(useRanking).mockReturnValue({
      ranking: mockRanking,
      isLoading: false,
      error: null,
    });

    renderPage();

    const link = screen.getByRole("link", { name: /interstellar/i });
    expect(link).toHaveAttribute("href", "/pelicula/1");
  });
});
