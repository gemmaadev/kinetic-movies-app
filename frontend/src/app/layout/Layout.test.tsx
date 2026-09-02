import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import Layout from "./Layout";
import { useAuth } from "@/features/auth/hooks/useAuth";

vi.mock("@/features/auth/hooks/useAuth", () => ({
  useAuth: vi.fn(),
}));

vi.mock("react-router", async () => {
  const actual = await vi.importActual("react-router");
  return {
    ...actual,
    ScrollRestoration: () => null,
  };
});

describe("Layout", () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue({
      user: null,
      isAuthenticated: false,
      loading: false,
      getIdToken: vi.fn(),
    });
  });

  // Scenario: Header with navigation is always visible
  //   Given the Layout is rendered
  //   When the page loads
  //   Then the header should be visible with the navigation links
  it("renders the header with navigation", () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<div>Test content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    const header = screen.getByRole("banner");
    expect(header).toBeInTheDocument();
    expect(
      within(header).getByRole("link", { name: /inicio/i }),
    ).toBeInTheDocument();
  });

  // Scenario: Active route's content renders inside the Outlet
  //   Given a route is active within the Layout
  //   When the page renders
  //   Then that route's content should be visible
  it("renders the active route's content inside the Outlet", () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<div>Test content</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });
});
