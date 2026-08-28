import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import ProfilePage from "./ProfilePage";
import { useProfile } from "@/features/auth/hooks/useProfile";
import { useLogout } from "@/features/auth/hooks/useLogout";

vi.mock("@/features/auth/hooks/useProfile", () => ({
  useProfile: vi.fn(),
}));

vi.mock("@/features/auth/hooks/useLogout", () => ({
  useLogout: vi.fn(),
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
  });

  // Scenario: Show loading state
  //   Given the profile is still being fetched
  //   When the page renders
  //   Then a loading indicator should be shown
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
  //   Given the profile request failed
  //   When the page renders
  //   Then an error message should be shown
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
  //   Given a loaded profile
  //   When the page renders
  //   Then the name and email should be visible
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
  //   Given a profile without an avatarUrl
  //   When the page renders
  //   Then the first letter of the name should be shown instead of a photo
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
  //   Given a profile with an avatarUrl (e.g. from Google)
  //   When the page renders
  //   Then the photo should be visible instead of the initial fallback
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
  //   Given a profile with a createdAt date
  //   When the page renders
  //   Then the year should be shown
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
  //   Given the profile page has loaded
  //   Then "Resumen" and "Favoritas" should be real links
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
  //   Given the profile page has loaded
  //   When I click "Cerrar sesión" in the sidebar
  //   Then a confirmation modal should appear, without calling logout yet
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
  //   Given the logout confirmation modal is open
  //   When I click "Cerrar sesión" inside the modal
  //   Then logout should be called
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
