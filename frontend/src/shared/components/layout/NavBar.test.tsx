import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import NavBar from "./NavBar";

describe("NavBar", () => {
  // Given a user is on any page with the NavBar rendered
  // When the page loads
  // Then all 5 navigation links are visible
  it("renders the 5 navigation links", () => {
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /inicio/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /explorar/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /ranking/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /favoritas/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /perfil/i })).toBeInTheDocument();
  });

  // Given the search icon is visible and the search input is closed
  // When the user clicks the search icon
  // Then the search input becomes visible
  it("opens the search input when clicking the search icon", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /buscar/i }));

    expect(
      screen.getByPlaceholderText(/buscar películas/i),
    ).toBeInTheDocument();
  });

  // Given the search input is open
  // When the user clicks the close button
  // Then the search input disappears
  it("closes the search input when clicking close", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /buscar/i }));
    await user.click(screen.getByRole("button", { name: /cerrar búsqueda/i }));

    expect(
      screen.queryByPlaceholderText(/buscar películas/i),
    ).not.toBeInTheDocument();
  });

  // Given the mobile menu is closed
  // When the user opens it and then closes it
  // Then the "open menu" button is available again, ready to be reopened
  it("opens and closes the mobile menu", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <NavBar />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole("button", { name: /abrir menú/i }));
    await user.click(screen.getByRole("button", { name: /cerrar menú/i }));

    // The "open menu" button is available again once closed
    expect(
      screen.getByRole("button", { name: /abrir menú/i }),
    ).toBeInTheDocument();
  });
});
