import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SocialAuthDivider } from "./SocialAuthDivider";

describe("SocialAuthDivider", () => {
  it("renders the divider text and the Google button", () => {
    render(<SocialAuthDivider onGoogleClick={vi.fn()} />);

    expect(screen.getByText("o continúa con")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /continuar con google/i }),
    ).toBeInTheDocument();
  });

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
