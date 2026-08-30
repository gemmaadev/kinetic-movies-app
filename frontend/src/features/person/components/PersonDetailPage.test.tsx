import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { PersonDetailPage } from "./PersonDetailPage";
import { usePersonDetail } from "@/features/person/hooks/usePersonDetail";
import { useFavoritesContext } from "@/features/favorites/hooks/useFavoritesContext";
import type { MovieCredit, Person } from "@/features/person/types/person.types";

vi.mock("@/features/person/hooks/usePersonDetail", () => ({
  usePersonDetail: vi.fn(),
}));

vi.mock("@/features/favorites/hooks/useFavoritesContext", () => ({
  useFavoritesContext: vi.fn(),
}));

interface RenderProps {
  getMovies: (
    filmography: MovieCredit[],
    filmographyAsDirector: MovieCredit[],
  ) => MovieCredit[];
  moviesTitle: string;
  notFoundMessage: string;
}

function renderWithRouter(props: RenderProps) {
  return render(
    <MemoryRouter initialEntries={["/person/1"]}>
      <Routes>
        <Route path="/person/:id" element={<PersonDetailPage {...props} />} />
      </Routes>
    </MemoryRouter>,
  );
}

const defaultProps: RenderProps = {
  getMovies: (filmography) => filmography,
  moviesTitle: "Películas destacadas",
  notFoundMessage: "Persona no encontrada.",
};

const mockPerson: Person = {
  id: 1,
  name: "Test Person",
  photoUrl: "https://example.com/photo.jpg",
  biography: "A test biography.",
  birthday: "1970-01-01",
  placeOfBirth: "Test City",
  filmography: Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    title: `Movie ${index + 1}`,
    posterUrl: null,
    voteAverage: 8,
    releaseYear: 2020,
  })),
  filmographyAsDirector: [],
};

describe("PersonDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useFavoritesContext).mockReturnValue({
      favoriteIds: new Set(),
      toggleFavorite: vi.fn(),
    });
  });

  // Scenario: Show loading indicator while data is being fetched
  //   Given I navigate to a person detail page
  //   When the data is still loading
  //   Then I should see a "Cargando..." indicator
  it("shows loading state", () => {
    vi.mocked(usePersonDetail).mockReturnValue({
      person: null,
      isLoading: true,
      error: null,
    });

    renderWithRouter(defaultProps);

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  // Scenario: Show an error message if the request fails
  //   Given I navigate to a person detail page
  //   When an error occurs while fetching the data
  //   Then I should see an error message
  it("shows error state", () => {
    vi.mocked(usePersonDetail).mockReturnValue({
      person: null,
      isLoading: false,
      error: "Network error",
    });

    renderWithRouter(defaultProps);

    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  // Scenario: Show the custom not-found message when the person doesn't exist
  //   Given I navigate to a person detail page with an invalid id
  //   When the request completes without finding the person
  //   Then I should see the notFoundMessage passed via props
  it("shows the custom not found message when person is null", () => {
    vi.mocked(usePersonDetail).mockReturnValue({
      person: null,
      isLoading: false,
      error: null,
    });

    renderWithRouter({
      ...defaultProps,
      notFoundMessage: "Actor no encontrado.",
    });

    expect(screen.getByText("Actor no encontrado.")).toBeInTheDocument();
  });

  // Scenario: View a person's detail sheet
  //   Given I navigate to the detail page of a person
  //   When the page finishes loading
  //   Then I should see their name
  it("renders the person's name when loaded", () => {
    vi.mocked(usePersonDetail).mockReturnValue({
      person: mockPerson,
      isLoading: false,
      error: null,
    });

    renderWithRouter(defaultProps);

    expect(
      screen.getByRole("heading", { name: "Test Person" }),
    ).toBeInTheDocument();
  });

  // Scenario: Use getMovies to select which filmography to display
  //   Given a person with both acting and directing credits
  //   When getMovies is provided to select the directing credits
  //   Then only those credits should be rendered
  it("calls getMovies with filmography and filmographyAsDirector, and renders its result", () => {
    const getMovies = vi.fn(
      (_: MovieCredit[], filmographyAsDirector: MovieCredit[]) =>
        filmographyAsDirector,
    );
    const personWithDirectorCredits: Person = {
      ...mockPerson,
      filmographyAsDirector: [
        {
          id: 200,
          title: "Directed Movie",
          posterUrl: null,
          voteAverage: 9,
          releaseYear: 2021,
        },
      ],
    };

    vi.mocked(usePersonDetail).mockReturnValue({
      person: personWithDirectorCredits,
      isLoading: false,
      error: null,
    });

    renderWithRouter({ ...defaultProps, getMovies });

    expect(getMovies).toHaveBeenCalledWith(
      personWithDirectorCredits.filmography,
      personWithDirectorCredits.filmographyAsDirector,
    );
    expect(screen.getByText("Directed Movie")).toBeInTheDocument();
    expect(screen.queryByText("Movie 1")).not.toBeInTheDocument();
  });

  // Scenario: Render the custom moviesTitle passed via props
  //   Given a moviesTitle prop
  //   When the page renders
  //   Then it should show that title above the movie grid
  it("renders the custom moviesTitle", () => {
    vi.mocked(usePersonDetail).mockReturnValue({
      person: mockPerson,
      isLoading: false,
      error: null,
    });

    renderWithRouter({ ...defaultProps, moviesTitle: "Películas dirigidas" });

    expect(
      screen.getByRole("heading", { name: "Películas dirigidas" }),
    ).toBeInTheDocument();
  });

  // Scenario: Limit featured movies and show "Ver toda su filmografía"
  //   Given the person has more movies than the featured limit
  //   When the page loads
  //   Then only the movies up to the limit should be shown
  //   And a "Ver toda su filmografía" button should be visible
  it("shows only the featured movie limit with a button to see the full filmography", () => {
    vi.mocked(usePersonDetail).mockReturnValue({
      person: mockPerson,
      isLoading: false,
      error: null,
    });

    renderWithRouter(defaultProps);

    expect(screen.getAllByText(/^Movie \d+$/)).toHaveLength(8);
    expect(
      screen.getByRole("button", { name: /ver toda su filmografía/i }),
    ).toBeInTheDocument();
  });
});
