import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import HomePage from "./HomePage";
import { useTrending } from "@/features/explore/hooks/useTrending";
import { useNowPlaying } from "@/features/explore/hooks/useNowPlaying";

vi.mock("@/features/explore/hooks/useTrending", () => ({
  useTrending: vi.fn(),
}));

vi.mock("@/features/explore/hooks/useNowPlaying", () => ({
  useNowPlaying: vi.fn(),
}));

describe("HomePage", () => {
  beforeEach(() => {
    vi.mocked(useTrending).mockReturnValue({
      movies: [],
      isLoading: false,
      error: null,
    });
    vi.mocked(useNowPlaying).mockReturnValue({
      movies: [],
      isLoading: false,
      error: null,
    });
  });

  // Given a user navigates to the home page
  // When the page loads
  // Then the hero title and subtitle are visible
  it("renders the hero title and subtitle", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/el cine que te/i)).toBeInTheDocument();
    expect(screen.getByText(/mueve/i)).toBeInTheDocument();
    expect(
      screen.getByText(/descubre películas increíbles/i),
    ).toBeInTheDocument();
  });

  // Given a user is on the home page
  // When the page loads
  // Then the "Explorar películas" CTA is visible and links to /explorar
  it("renders the CTA linking to /explorar", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    const cta = screen.getByRole("link", { name: /explorar películas/i });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", "/explorar");
  });

  // Given a user is on the home page
  // When the page loads
  // Then both movie rows (trending and now-playing) are visible
  it("renders both trending and now-playing movie rows", () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    expect(screen.getByText(/tendencias de esta semana/i)).toBeInTheDocument();
    expect(screen.getByText(/en cines/i)).toBeInTheDocument();
  });
});
