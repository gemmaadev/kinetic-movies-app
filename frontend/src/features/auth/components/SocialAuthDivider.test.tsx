import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SocialAuthDivider } from "./SocialAuthDivider";

describe("SocialAuthDivider", () => {
  // Scenario: Render the divider and the Google button
  //   Given the SocialAuthDivider is rendered
  //   Then the "o continúa con" text and the Google button should be visible
  it("renders the divider text and the Google button", () => {
    render(<SocialAuthDivider onGoogleClick={vi.fn()} />);

    expect(screen.getByText("o continúa con")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /continuar con google/i }),
    ).toBeInTheDocument();
  });

  // Scenario: Click the Google button
  //   Given the SocialAuthDivider is rendered
  //   When I click "Continuar con Google"
  //   Then onGoogleClick should be called
  it("calls onGoogleClick when the button is clicked", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<SocialAuthDivider onGoogleClick={handleClick} />);

    await user.click(
      screen.getByRole("button", { name: /continuar con google/i }),
    );

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
