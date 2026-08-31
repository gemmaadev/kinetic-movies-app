import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import ProfilePage from "./ProfilePage";
import { useProfile } from "@/features/auth/hooks/useProfile";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useFavoritesContext } from "@/features/favorites/hooks/useFavoritesContext";

vi.mock("@/features/auth/hooks/useProfile", () => ({
  useProfile: vi.fn(),
}));

vi.mock("@/features/auth/hooks/useLogout", () => ({
  useLogout: vi.fn(),
}));

vi.mock("@/features/favorites/hooks/useFavoritesContext", () => ({
  useFavoritesContext: vi.fn(),
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

describe("ProfilePage", () => {
  const logout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useLogout).mockReturnValue(logout);
    vi.mocked(useFavoritesContext).mockReturnValue({
      favoriteIds: new Set(),
      toggleFavorite: vi.fn(),
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
});
