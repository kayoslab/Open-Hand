import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Card } from "../../src/domain/card";

// Helper to build a card with sensible defaults
function makeCard(overrides: Partial<Card> = {}): Card {
  return {
    cardNumber: 1,
    category: "Infrastructure",
    tier: "Open",
    prompt: "What does success look like?",
    guidance: "Explore how the person defines a positive outcome.",
    flavourText: "Begin with the end in mind.",
    ...overrides,
  };
}

// Lazy import so the test file can exist before the component does
async function importCardVisual() {
  const mod = await import("../../src/ui/CardVisual/CardVisual");
  return mod.CardVisual;
}

describe("CardVisual component", () => {
  it("renders the prompt field as the card title", async () => {
    const CardVisual = await importCardVisual();
    render(<CardVisual card={makeCard({ prompt: "How are you feeling?" })} />);
    expect(screen.getByText("How are you feeling?")).toBeInTheDocument();
  });

  it("renders the guidance field as question text", async () => {
    const CardVisual = await importCardVisual();
    render(
      <CardVisual card={makeCard({ guidance: "Invite honest reflection." })} />
    );
    expect(screen.getByText("Invite honest reflection.")).toBeInTheDocument();
  });

  it("renders the category label", async () => {
    const CardVisual = await importCardVisual();
    render(
      <CardVisual card={makeCard({ category: "Feedback and Repair" })} />
    );
    expect(screen.getByText("Feedback and Repair")).toBeInTheDocument();
  });

  it("renders tier marker with text label for Open tier", async () => {
    const CardVisual = await importCardVisual();
    render(<CardVisual card={makeCard({ tier: "Open" })} />);
    expect(screen.getByText("Open")).toBeInTheDocument();
  });

  it("renders tier marker with text label for Working tier", async () => {
    const CardVisual = await importCardVisual();
    render(<CardVisual card={makeCard({ tier: "Working" })} />);
    expect(screen.getByText("Working")).toBeInTheDocument();
  });

  it("renders tier marker with text label for Deep tier", async () => {
    const CardVisual = await importCardVisual();
    render(<CardVisual card={makeCard({ tier: "Deep" })} />);
    expect(screen.getByText("Deep")).toBeInTheDocument();
  });

  it("renders flavour text when present", async () => {
    const CardVisual = await importCardVisual();
    render(
      <CardVisual
        card={makeCard({ flavourText: "Curiosity before judgement." })}
      />
    );
    expect(
      screen.getByText("Curiosity before judgement.")
    ).toBeInTheDocument();
  });

  it("does NOT render flavour text element when flavourText is empty string", async () => {
    const CardVisual = await importCardVisual();
    const { container } = render(
      <CardVisual card={makeCard({ flavourText: "" })} />
    );
    // The component should not render any element with a flavour-text related class or data attribute
    const flavourEl =
      container.querySelector("[data-testid='flavour-text']") ??
      container.querySelector(".flavourText");
    expect(flavourEl).toBeNull();
  });

  it("tier marker has correct data-tier attribute for each tier", async () => {
    const CardVisual = await importCardVisual();

    for (const tier of ["Open", "Working", "Deep"] as const) {
      const { unmount } = render(<CardVisual card={makeCard({ tier })} />);
      const tierEl = screen.getByText(tier).closest("[data-tier]");
      expect(tierEl).not.toBeNull();
      expect(tierEl).toHaveAttribute(
        "data-tier",
        tier.toLowerCase()
      );
      unmount();
    }
  });

  it("uses semantic HTML — renders as an article element", async () => {
    const CardVisual = await importCardVisual();
    render(<CardVisual card={makeCard()} />);
    expect(screen.getByRole("article")).toBeInTheDocument();
  });

  it("displays all card fields together in a single render", async () => {
    const CardVisual = await importCardVisual();
    const card = makeCard({
      prompt: "Where do you want to grow?",
      guidance: "Focus on aspiration, not gaps.",
      category: "Growth and Direction",
      tier: "Deep",
      flavourText: "Growth is a direction, not a destination.",
    });
    render(<CardVisual card={card} />);

    expect(screen.getByText("Where do you want to grow?")).toBeInTheDocument();
    expect(
      screen.getByText("Focus on aspiration, not gaps.")
    ).toBeInTheDocument();
    expect(screen.getByText("Growth and Direction")).toBeInTheDocument();
    expect(screen.getByText("Deep")).toBeInTheDocument();
    expect(
      screen.getByText("Growth is a direction, not a destination.")
    ).toBeInTheDocument();
  });
});
