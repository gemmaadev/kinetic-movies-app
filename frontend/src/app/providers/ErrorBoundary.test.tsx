import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import ErrorBoundary from "./ErrorBoundary";

function ProblemChild(): ReactElement {
  throw new Error("Simulated error");
}

describe("ErrorBoundary", () => {
  it("shows the fallback when a child throws an error", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>,
    );

    expect(screen.getByText("Algo ha ido mal")).toBeInTheDocument();
  });

  it("renders children normally when there is no error", () => {
    render(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>,
    );

    expect(screen.getByText("Normal content")).toBeInTheDocument();
  });
});
