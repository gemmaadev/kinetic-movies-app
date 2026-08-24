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

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("hello", 400));

    expect(result.current).toBe("hello");
  });

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
