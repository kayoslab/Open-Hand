import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import App from "../../src/App";

function setHash(hash: string) {
  window.location.hash = hash;
  window.dispatchEvent(new HashChangeEvent("hashchange"));
}

describe("Hash-based routing", () => {
  beforeEach(() => {
    window.location.hash = "";
  });

  it("renders home page for empty hash", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /better conversations/i })
    ).toBeInTheDocument();
  });

  it("renders home page for #/ hash", () => {
    window.location.hash = "#/";
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /better conversations/i })
    ).toBeInTheDocument();
  });

  it("navigates to browse page on hash change", () => {
    render(<App />);
    act(() => setHash("#/browse"));
    expect(
      screen.getByRole("heading", { name: /browse/i })
    ).toBeInTheDocument();
  });

  it("navigates to single draw page on hash change", () => {
    render(<App />);
    act(() => setHash("#/play"));
    expect(
      screen.getByRole("heading", { name: /draw/i })
    ).toBeInTheDocument();
  });

  it("navigates to draw three page on hash change", () => {
    render(<App />);
    act(() => setHash("#/play/draw-three"));
    expect(
      screen.getByRole("heading", { name: /draw three/i })
    ).toBeInTheDocument();
  });

  it("navigates to guide page on hash change", () => {
    render(<App />);
    act(() => setHash("#/guide"));
    expect(
      screen.getByRole("heading", { name: /guide/i })
    ).toBeInTheDocument();
  });

  it("falls back to home page for unknown routes", () => {
    render(<App />);
    act(() => setHash("#/nonexistent"));
    expect(
      screen.getByRole("heading", { name: /better conversations/i })
    ).toBeInTheDocument();
  });

  it("can navigate back to home from another route", () => {
    render(<App />);
    act(() => setHash("#/browse"));
    expect(
      screen.getByRole("heading", { name: /browse/i })
    ).toBeInTheDocument();

    act(() => setHash("#/"));
    expect(
      screen.getByRole("heading", { name: /better conversations/i })
    ).toBeInTheDocument();
  });

  it("cleans up hashchange listener on unmount", () => {
    const addSpy = vi.spyOn(window, "addEventListener");
    const removeSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = render(<App />);

    expect(addSpy).toHaveBeenCalledWith("hashchange", expect.any(Function));

    unmount();

    expect(removeSpy).toHaveBeenCalledWith(
      "hashchange",
      expect.any(Function)
    );

    addSpy.mockRestore();
    removeSpy.mockRestore();
  });
});
