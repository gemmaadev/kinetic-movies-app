import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FavoriteButton } from "./FavoriteButton";
import { useFavoritesContext } from "@/features/favorites/hooks/useFavoritesContext";

vi.mock("@/features/favorites/hooks/useFavoritesContext", () => ({
  useFavoritesContext: vi.fn(),
}));

describe("FavoriteButton", () => {
  const toggleFavorite = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    toggleFavorite.mockResolvedValue(undefined);
  });

  // Scenario: Movie is not a favorite yet
  //   Given the movieId is not in favoriteIds
  //   When the button renders
  //   Then it should show as unmarked
  it("renders unmarked when the movie is not a favorite", () => {
    vi.mocked(useFavoritesContext).mockReturnValue({
      favoriteIds: new Set(),
      toggleFavorite,
    });

    render(<FavoriteButton movieId={550} />);

    const button = screen.getByRole("button", { name: /añadir a favoritas/i });
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  // Scenario: Movie is already a favorite
  //   Given the movieId is in favoriteIds
  //   When the button renders
  //   Then it should show as marked
  it("renders marked when the movie is a favorite", () => {
    vi.mocked(useFavoritesContext).mockReturnValue({
      favoriteIds: new Set([550]),
      toggleFavorite,
    });

    render(<FavoriteButton movieId={550} />);

    const button = screen.getByRole("button", { name: /quitar de favoritas/i });
    expect(button).toHaveAttribute("aria-pressed", "true");
  });

  // Scenario: Click calls toggleFavorite with the correct movieId
  //   Given the button is rendered
  //   When I click it
  //   Then toggleFavorite should be called with this movie's id
  it("calls toggleFavorite with the movieId on click", async () => {
    vi.mocked(useFavoritesContext).mockReturnValue({
      favoriteIds: new Set(),
      toggleFavorite,
    });
    const user = userEvent.setup();

    render(<FavoriteButton movieId={550} />);

    await user.click(screen.getByRole("button"));

    expect(toggleFavorite).toHaveBeenCalledWith(550);
  });

  // Scenario: Render the button variant with text
  //   Given variant="button"
  //   When the component renders
  //   Then it should show the full text button instead of just an icon
  it("renders the button variant with text", () => {
    vi.mocked(useFavoritesContext).mockReturnValue({
      favoriteIds: new Set(),
      toggleFavorite,
    });

    render(<FavoriteButton movieId={550} variant="button" />);

    expect(screen.getByText("Añadir a favoritas")).toBeInTheDocument();
  });

  // Scenario: Button variant reflects favorite state in its text
  //   Given the movie is a favorite and variant="button"
  //   When the component renders
  //   Then the button text should say "En favoritas"
  it("shows 'En favoritas' text when the movie is a favorite in button variant", () => {
    vi.mocked(useFavoritesContext).mockReturnValue({
      favoriteIds: new Set([550]),
      toggleFavorite,
    });

    render(<FavoriteButton movieId={550} variant="button" />);

    expect(screen.getByText("En favoritas")).toBeInTheDocument();
  });
});
