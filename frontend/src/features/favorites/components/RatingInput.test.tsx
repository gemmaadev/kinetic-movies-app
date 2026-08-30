import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RatingInput } from "./RatingInput";

describe("RatingInput", () => {
  // Scenario: No rating yet
  //   Given the movie has no rating
  //   When the component renders
  //   Then no score text should be shown
  it("shows no score text when value is null", () => {
    render(<RatingInput value={null} onChange={vi.fn()} />);

    expect(screen.queryByText(/\/10/)).not.toBeInTheDocument();
  });

  // Scenario: Existing rating is displayed
  //   Given the movie already has a rating of 6
  //   When the component renders
  //   Then it should show "6/10"
  it("shows the current rating as text", () => {
    render(<RatingInput value={6} onChange={vi.fn()} />);

    expect(screen.getByText("6/10")).toBeInTheDocument();
  });

  // Scenario: Click the right half of a star gives a full/even value
  //   Given no rating yet
  //   When I click the right half of the 3rd star
  //   Then onChange should be called with 6 (3 * 2)
  it("calls onChange with an even value when clicking the right half of a star", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<RatingInput value={null} onChange={handleChange} />);

    const rightHalfButtons = screen.getAllByLabelText(/de 10$/);
    const thirdStarFull = rightHalfButtons.find(
      (btn) => btn.getAttribute("aria-label") === "Puntuar con 6 de 10",
    );

    await user.click(thirdStarFull!);

    expect(handleChange).toHaveBeenCalledWith(6);
  });

  // Scenario: Click the left half of a star gives a half/odd value
  //   Given no rating yet
  //   When I click the left half of the 3rd star
  //   Then onChange should be called with 5 (3 * 2 - 1)
  it("calls onChange with an odd value when clicking the left half of a star", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<RatingInput value={null} onChange={handleChange} />);

    const button = screen.getByLabelText("Puntuar con 5 de 10");

    await user.click(button);

    expect(handleChange).toHaveBeenCalledWith(5);
  });

  // Scenario: Hovering previews the rating without calling onChange
  //   Given no rating yet
  //   When I hover over the 4th star's right half
  //   Then the preview text should show "8/10" without onChange being called
  it("previews the rating on hover without calling onChange", async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();

    render(<RatingInput value={null} onChange={handleChange} />);

    const button = screen.getByLabelText("Puntuar con 8 de 10");

    await user.hover(button);

    expect(screen.getByText("8/10")).toBeInTheDocument();
    expect(handleChange).not.toHaveBeenCalled();
  });

  // Scenario: Mouse leaving the group reverts to the real value
  //   Given a confirmed rating of 4
  //   When I hover over a different star and then leave
  //   Then the display should revert to "4/10"
  it("reverts to the real value after the mouse leaves", async () => {
    const user = userEvent.setup();

    render(<RatingInput value={4} onChange={vi.fn()} />);

    const button = screen.getByLabelText("Puntuar con 8 de 10");
    await user.hover(button);
    expect(screen.getByText("8/10")).toBeInTheDocument();

    await user.unhover(button);
    expect(screen.getByText("4/10")).toBeInTheDocument();
  });
});