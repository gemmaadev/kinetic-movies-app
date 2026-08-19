import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import NotFoundPage from "./NotFoundPage";

describe("NotFoundPage", () => {
  // Given a user navigates to a non-existent route
  // When the page loads
  // Then the 404 error message is visible
  it("renders the 404 error message", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

    expect(screen.getByText("Error 404")).toBeInTheDocument();
    expect(
      screen.getByText(/houston, tenemos un problema/i),
    ).toBeInTheDocument();
  });

  // Given a user is on the 404 page
  // When the page loads
  // Then a "volver al inicio" link is visible and points to the home page
  it("renders a link back to the home page", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

    const backLink = screen.getByRole("link", { name: /volver al inicio/i });
    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute("href", "/");
  });
});
