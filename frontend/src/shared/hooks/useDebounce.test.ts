import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  // Scenario: Initial value is returned immediately
  //   Given a value passed to the hook
  //   When it first renders
  //   Then it should return that value without waiting
  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 400));

    expect(result.current).toBe("hello");
  });

  // Scenario: Value has not updated yet, delay not reached
  //   Given the value changes
  //   When less time than the delay has passed
  //   Then the hook should still return the old value
  it("does not update before the delay has passed", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      { initialProps: { value: "hello" } },
    );

    rerender({ value: "hello world" });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("hello");
  });

  // Scenario: Value updates after the delay
  //   Given the value changes
  //   When the full delay has passed
  //   Then the hook should return the new value
  it("updates after the delay has passed", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      { initialProps: { value: "hello" } },
    );

    rerender({ value: "hello world" });

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current).toBe("hello world");
  });

  // Scenario: Multiple rapid changes only apply the last value
  //   Given the value changes several times in quick succession
  //   When the delay finally passes
  //   Then only the most recent value should be applied
  it("only applies the last value when changed multiple times quickly", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 400),
      { initialProps: { value: "d" } },
    );

    rerender({ value: "di" });
    act(() => vi.advanceTimersByTime(100));
    rerender({ value: "div" });
    act(() => vi.advanceTimersByTime(100));
    rerender({ value: "dive" });

    act(() => {
      vi.advanceTimersByTime(400);
    });

    expect(result.current).toBe("dive");
  });
});
