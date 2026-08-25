import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import DirectorDetailPage from "./DirectorDetailPage";
import { usePersonDetail } from "@/features/person/hooks/usePersonDetail";

vi.mock("@/features/person/hooks/usePersonDetail", () => ({
  usePersonDetail: vi.fn(),
}));

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={["/director/525"]}>
      <Routes>
        <Route path="/director/:id" element={<DirectorDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

const mockDirector = {
  id: 525,
  name: "Christopher Nolan",
  photoUrl: "https://image.tmdb.org/t/p/w500/nolan.jpg",
  biography: "British-American film director.",
  birthday: "1970-07-30",
  placeOfBirth: "London, UK",
  filmography: Array.from({ length: 5 }, (_, index) => ({
    id: index + 1,
    title: `Acting Movie ${index + 1}`,
    posterUrl: null,
    voteAverage: 7,
    releaseYear: 2020,
  })),
  filmographyAsDirector: Array.from({ length: 10 }, (_, index) => ({
    id: index + 100,
    title: `Directed Movie ${index + 1}`,
    posterUrl: null,
    voteAverage: 8,
    releaseYear: 2020,
  })),
};

describe("DirectorDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Scenario: Show loading indicator while data is being fetched
  //   Given I navigate to a director detail page
  //   When the data is still loading
  //   Then I should see a "Cargando..." indicator
  it("shows loading state", () => {
    vi.mocked(usePersonDetail).mockReturnValue({
      person: null,
      isLoading: true,
      error: null,
    });

    renderWithRouter();

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  // Scenario: Show an error message if the request fails
  //   Given I navigate to a director detail page
  //   When an error occurs while fetching the data
  //   Then I should see an error message
  it("shows error state", () => {
    vi.mocked(usePersonDetail).mockReturnValue({
      person: null,
      isLoading: false,
      error: "Network error",
    });

    renderWithRouter();

    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  // Scenario: Show not-found page if the director doesn't exist
  //   Given I navigate to a director detail page with an invalid id
  //   When the request completes without finding the director
  //   Then I should see the message "Director no encontrado"
  it("shows not found state when person is null", () => {
    vi.mocked(usePersonDetail).mockReturnValue({
      person: null,
      isLoading: false,
      error: null,
    });

    renderWithRouter();

    expect(screen.getByText(/no encontrado/i)).toBeInTheDocument();
  });

  // Scenario: View a director's detail sheet
  //   Given I navigate to the detail page of "Christopher Nolan"
  //   When the page finishes loading
  //   Then I should see their name
  it("renders the director's name when loaded", () => {
    vi.mocked(usePersonDetail).mockReturnValue({
      person: mockDirector,
      isLoading: false,
      error: null,
    });

    renderWithRouter();

    expect(
      screen.getByRole("heading", { name: "Christopher Nolan" }),
    ).toBeInTheDocument();
  });

  // Scenario: Only show movies directed by this person, not their acting credits
  //   Given a person with both filmography (as actor) and filmographyAsDirector
  //   When the director detail page renders
  //   Then only the directing credits should be displayed
  it("shows only filmographyAsDirector, not filmography (acting credits)", () => {
    vi.mocked(usePersonDetail).mockReturnValue({
      person: mockDirector,
      isLoading: false,
      error: null,
    });

    renderWithRouter();

    expect(screen.queryByText("Acting Movie 1")).not.toBeInTheDocument();
    expect(screen.getByText("Directed Movie 1")).toBeInTheDocument();
  });

  // Scenario: Limit featured directed movies and show "Ver toda su filmografía"
  //   Given the director has more directed movies than the featured limit
  //   When the page loads
  //   Then only the movies up to the limit should be shown
  //   And a "Ver toda su filmografía" button should be visible
  it("shows only the featured movie limit with a button to see the full filmography", () => {
    vi.mocked(usePersonDetail).mockReturnValue({
      person: mockDirector,
      isLoading: false,
      error: null,
    });

    renderWithRouter();

    expect(screen.getAllByText(/^Directed Movie \d+$/)).toHaveLength(8);
    expect(
      screen.getByRole("button", { name: /ver toda su filmografía/i }),
    ).toBeInTheDocument();
  });
});
