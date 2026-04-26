import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../../src/App";

describe("App component", () => {
  it("renders without crashing", () => {
    render(<App />);
  });

  it("displays the Card Deck v2 heading", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: /card deck/i })
    ).toBeInTheDocument();
  });
});
