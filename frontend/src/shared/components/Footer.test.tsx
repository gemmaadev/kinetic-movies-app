import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { Footer } from "./Footer";

describe("Footer", () => {
  // Given the Footer is rendered
  // When the page loads
  // Then the logo and description are visible
  it("renders the logo and description", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByAltText("Kinetic logo")).toBeInTheDocument();
    expect(
      screen.getByText(/tu plataforma personal para explorar/i),
    ).toBeInTheDocument();
  });

  // Given the Footer is rendered
  // When the page loads
  // Then all 4 column titles are visible
  it("renders the 4 column titles", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByText("DESCUBRIR")).toBeInTheDocument();
    expect(screen.getByText("CUENTA")).toBeInTheDocument();
    expect(screen.getByText("LEGAL")).toBeInTheDocument();
    expect(screen.getByText("SÍGUENOS")).toBeInTheDocument();
  });

  // Given the Footer is rendered
  // When the page loads
  // Then the "Descubrir" column links are visible
  it("renders the discover links", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: "Inicio" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explorar" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ranking" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Favoritos" })).toBeInTheDocument();
  });

  // Given the Footer is rendered
  // When the page loads
  // Then the 3 social media icons are visible, each linking externally
  it("renders the 3 social media links", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    const instagramLink = screen.getByRole("link", { name: /instagram/i });
    const facebookLink = screen.getByRole("link", { name: /facebook/i });
    const twitterLink = screen.getByRole("link", { name: /twitter/i });

    expect(instagramLink).toBeInTheDocument();
    expect(facebookLink).toBeInTheDocument();
    expect(twitterLink).toBeInTheDocument();

    expect(instagramLink).toHaveAttribute("target", "_blank");
  });

  // Given the Footer is rendered
  // When the page loads
  // Then the copyright notice is visible
  it("renders the copyright notice", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(
      screen.getByText(/todos los derechos reservados/i),
    ).toBeInTheDocument();
  });
});
