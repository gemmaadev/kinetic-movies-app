import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import ActorDetailPage from "./ActorDetailPage";
import { usePersonDetail } from "@/features/person/hooks/usePersonDetail";

vi.mock("@/features/person/hooks/usePersonDetail", () => ({
  usePersonDetail: vi.fn(),
}));

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={["/actor/6193"]}>
      <Routes>
        <Route path="/actor/:id" element={<ActorDetailPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

const mockPerson = {
  id: 6193,
  name: "Leonardo DiCaprio",
  photoUrl: "https://image.tmdb.org/t/p/w500/dicaprio.jpg",
  biography: "American actor and producer.",
  birthday: "1974-11-11",
  placeOfBirth: "Los Angeles, California, USA",
  filmography: Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    title: `Movie ${index + 1}`,
    posterUrl: null,
    voteAverage: 8,
    releaseYear: 2020,
  })),
  filmographyAsDirector: [],
};

describe("ActorDetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Scenario: Show loading indicator while data is being fetched
  //   Given I navigate to an actor detail page
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
  //   Given I navigate to an actor detail page
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

  // Scenario: Show not-found page if the actor doesn't exist
  //   Given I navigate to an actor detail page with an invalid id
  //   When the request completes without finding the actor
  //   Then I should see the message "Actor no encontrado"
  it("shows not found state when person is null", () => {
    vi.mocked(usePersonDetail).mockReturnValue({
      person: null,
      isLoading: false,
      error: null,
    });

    renderWithRouter();

    expect(screen.getByText(/no encontrado/i)).toBeInTheDocument();
  });

  // Scenario: View an actor's detail sheet
  //   Given I navigate to the detail page of "Leonardo DiCaprio"
  //   When the page finishes loading
  //   Then I should see their name
  it("renders the actor's name when loaded", () => {
    vi.mocked(usePersonDetail).mockReturnValue({
      person: mockPerson,
      isLoading: false,
      error: null,
    });

    renderWithRouter();

    expect(
      screen.getByRole("heading", { name: "Leonardo DiCaprio" }),
    ).toBeInTheDocument();
  });

  // Scenario: Limit featured movies and show "Ver toda su filmografía"
  //   Given the actor has more movies than the featured limit
  //   When the page loads
  //   Then only the first movies up to the limit should be shown
  //   And a "Ver toda su filmografía" button should be visible
  it("shows only the featured movie limit with a button to sefe the full filmography", () => {
    vi.mocked(usePersonDetail).mockReturnValue({
      person: mockPerson,
      isLoading: false,
      error: null,
    });

    renderWithRouter();

    expect(screen.getAllByText(/^Movie \d+$/)).toHaveLength(8);
    expect(
      screen.getByRole("button", { name: /ver toda su filmografía/i }),
    ).toBeInTheDocument();
  });

  // Scenario: Expand to see the full filmography
  //   Given the actor has more movies than the featured limit
  //   When I click "Ver toda su filmografía"
  //   Then all their movies should be shown
  it("shows all movies after clicking 'Ver toda su filmografía'", async () => {
    const { default: userEvent } = await import("@testing-library/user-event");
    const user = userEvent.setup();

    vi.mocked(usePersonDetail).mockReturnValue({
      person: mockPerson,
      isLoading: false,
      error: null,
    });

    renderWithRouter();

    await user.click(
      screen.getByRole("button", { name: /ver toda su filmografía/i }),
    );

    expect(screen.getAllByText(/^Movie \d+$/)).toHaveLength(10);
  });
});
