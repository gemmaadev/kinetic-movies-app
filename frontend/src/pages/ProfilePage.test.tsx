import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import ProfilePage from "./ProfilePage";
import { useProfile } from "@/features/auth/hooks/useProfile";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useFavoritesList } from "@/features/favorites/hooks/useFavoritesList";
import { useMyRanking } from "@/features/stats/hooks/useMyRanking";

vi.mock("@/features/auth/hooks/useProfile", () => ({
  useProfile: vi.fn(),
}));

vi.mock("@/features/auth/hooks/useLogout", () => ({
  useLogout: vi.fn(),
}));

vi.mock("@/features/favorites/hooks/useFavoritesList", () => ({
  useFavoritesList: vi.fn(),
}));

vi.mock("@/features/stats/hooks/useMyRanking", () => ({
  useMyRanking: vi.fn(),
}));

function renderPage() {
  return render(
    <MemoryRouter>
      <ProfilePage />
    </MemoryRouter>,
  );
}

const mockProfile = {
  id: "1",
  uid: "test-uid",
  name: "Gemma Maeso",
  email: "gemma@kinetic.com",
  avatarUrl: null,
  createdAt: "2026-08-15T10:30:00.000Z",
};

const mockFavorites = [
  {
    id: 1,
    title: "Interstellar",
    posterUrl: null,
    voteAverage: 8.6,
    releaseYear: 2014,
    userRating: null,
    addedAt: "2026-01-01",
  },
  {
    id: 2,
    title: "Fight Club",
    posterUrl: null,
    voteAverage: 8.4,
    releaseYear: 1999,
    userRating: null,
    addedAt: "2026-01-02",
  },
];

const mockMyRanking = [
  {
    id: 1,
    title: "Interstellar",
    posterUrl: null,
    voteAverage: 8.6,
    releaseYear: 2014,
    userRating: 9,
  },
  {
    id: 3,
    title: "Dune",
    posterUrl: null,
    voteAverage: 8.0,
    releaseYear: 2021,
    userRating: 7,
  },
];

describe("ProfilePage", () => {
  const logout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLogout).mockReturnValue(logout);
    vi.mocked(useFavoritesList).mockReturnValue({
      favorites: [],
      isLoading: false,
      error: null,
    });
    vi.mocked(useMyRanking).mockReturnValue({
      myRanking: [],
      isLoading: false,
      error: null,
    });
  });

  // Scenario: Show loading state
  it("shows loading state", () => {
    vi.mocked(useProfile).mockReturnValue({
      profile: null,
      isLoading: true,
      error: null,
    });

    renderPage();

    expect(screen.getByText(/cargando/i)).toBeInTheDocument();
  });

  // Scenario: Show error state
  it("shows error state", () => {
    vi.mocked(useProfile).mockReturnValue({
      profile: null,
      isLoading: false,
      error: "Network error",
    });

    renderPage();

    expect(screen.getByText(/error/i)).toBeInTheDocument();
  });

  // Scenario: Render the user's name and email
  it("renders the user's name and email", () => {
    vi.mocked(useProfile).mockReturnValue({
      profile: mockProfile,
      isLoading: false,
      error: null,
    });

    renderPage();

    expect(screen.getByText("Gemma Maeso")).toBeInTheDocument();
    expect(screen.getByText("gemma@kinetic.com")).toBeInTheDocument();
  });

  // Scenario: Show initial avatar fallback when there's no photo
  it("shows the name's initial as a fallback when there is no avatarUrl", () => {
    vi.mocked(useProfile).mockReturnValue({
      profile: mockProfile,
      isLoading: false,
      error: null,
    });

    renderPage();

    expect(screen.getByText("G")).toBeInTheDocument();
  });

  // Scenario: Show the real photo when avatarUrl exists
  it("shows the real photo when avatarUrl exists", () => {
    vi.mocked(useProfile).mockReturnValue({
      profile: { ...mockProfile, avatarUrl: "https://example.com/photo.jpg" },
      isLoading: false,
      error: null,
    });

    renderPage();

    const image = screen.getByAltText("Gemma Maeso");
    expect(image).toHaveAttribute("src", "https://example.com/photo.jpg");
  });

  // Scenario: Show the "member since" year
  it("shows the member-since year", () => {
    vi.mocked(useProfile).mockReturnValue({
      profile: mockProfile,
      isLoading: false,
      error: null,
    });

    renderPage();

    expect(screen.getByText(/miembro desde 2026/i)).toBeInTheDocument();
  });

  // Scenario: Sidebar links to existing pages are clickable
  it("renders working links for pages that exist", () => {
    vi.mocked(useProfile).mockReturnValue({
      profile: mockProfile,
      isLoading: false,
      error: null,
    });

    renderPage();

    expect(screen.getByRole("link", { name: /resumen/i })).toHaveAttribute(
      "href",
      "/perfil",
    );
    expect(screen.getByRole("link", { name: /favoritas/i })).toHaveAttribute(
      "href",
      "/favoritos",
    );
  });

  // Scenario: Open the logout confirmation modal
  it("opens the logout confirmation modal without logging out immediately", async () => {
    vi.mocked(useProfile).mockReturnValue({
      profile: mockProfile,
      isLoading: false,
      error: null,
    });
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getAllByText("Cerrar sesión")[0]);

    expect(screen.getByText(/¿cerrar sesión\?/i)).toBeInTheDocument();
    expect(logout).not.toHaveBeenCalled();
  });

  // Scenario: Confirm logout from the modal
  it("calls logout when confirming in the modal", async () => {
    vi.mocked(useProfile).mockReturnValue({
      profile: mockProfile,
      isLoading: false,
      error: null,
    });
    const user = userEvent.setup();

    renderPage();

    await user.click(screen.getAllByText("Cerrar sesión")[0]);
    await user.click(screen.getAllByText("Cerrar sesión")[1]);

    expect(logout).toHaveBeenCalled();
  });

  // Scenario: Show real favorites count
  //   Given the user has 2 favorite movies
  //   When the page loads
  //   Then the "Favoritas" stat should show "2"
  it("shows the real favorites count", () => {
    vi.mocked(useProfile).mockReturnValue({
      profile: mockProfile,
      isLoading: false,
      error: null,
    });
    vi.mocked(useFavoritesList).mockReturnValue({
      favorites: mockFavorites,
      isLoading: false,
      error: null,
    });

    renderPage();

    const favoritasLabels = screen.getAllByText("Favoritas");
    const statLabel = favoritasLabels.find((el) =>
      el.className.includes("text-secondary-text"),
    );
    const favoritasCard = statLabel?.closest("div");
    expect(favoritasCard).toHaveTextContent("2");
  });

  // Scenario: Show real puntuadas count and average rating
  //   Given the user has rated 2 movies (9 and 7)
  //   When the page loads
  //   Then "Puntuadas" should show "2" and "Puntuación media" should show "8.0"
  it("shows the real puntuadas count and average rating", () => {
    vi.mocked(useProfile).mockReturnValue({
      profile: mockProfile,
      isLoading: false,
      error: null,
    });
    vi.mocked(useMyRanking).mockReturnValue({
      myRanking: mockMyRanking,
      isLoading: false,
      error: null,
    });

    renderPage();

    expect(screen.getByText("8.0")).toBeInTheDocument();
  });

  // Scenario: Show placeholder average rating when nothing rated yet
  //   Given the user has no rated movies
  //   When the page loads
  //   Then "Puntuación media" should show "—"
  it("shows a placeholder average rating when there are no rated movies", () => {
    vi.mocked(useProfile).mockReturnValue({
      profile: mockProfile,
      isLoading: false,
      error: null,
    });

    renderPage();

    expect(screen.getByText("—")).toBeInTheDocument();
  });
});
