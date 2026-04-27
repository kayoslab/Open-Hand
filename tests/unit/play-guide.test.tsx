import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlayGuide } from "../../src/features/guide";

describe("PlayGuide component", () => {
  it("renders without crashing", () => {
    render(<PlayGuide />);
    expect(screen.getByRole("main") || document.body).toBeTruthy();
  });

  it("renders 'Structure at a glance' section", () => {
    render(<PlayGuide />);
    expect(
      screen.getByRole("heading", { name: /structure at a glance/i })
    ).toBeInTheDocument();
  });

  it("renders 'Three ways to play' section", () => {
    render(<PlayGuide />);
    expect(
      screen.getByRole("heading", { name: /three ways to play/i })
    ).toBeInTheDocument();
  });

  it("renders 'Rituals' section", () => {
    render(<PlayGuide />);
    expect(
      screen.getByRole("heading", { name: /rituals/i })
    ).toBeInTheDocument();
  });

  it("renders 'Pairing references' section", () => {
    render(<PlayGuide />);
    expect(
      screen.getByRole("heading", { name: /pairing references/i })
    ).toBeInTheDocument();
  });

  it("renders 'Flavour text' section", () => {
    render(<PlayGuide />);
    expect(
      screen.getByRole("heading", { name: /flavour text/i })
    ).toBeInTheDocument();
  });
});

describe("PlayGuide subsections for ways to play", () => {
  it("renders Draw Three Keep One subsection", () => {
    render(<PlayGuide />);
    expect(
      screen.getByRole("heading", { name: /draw three.*keep one/i })
    ).toBeInTheDocument();
  });

  it("renders feedback conversation subsection", () => {
    render(<PlayGuide />);
    expect(
      screen.getByRole("heading", { name: /feedback conversation/i })
    ).toBeInTheDocument();
  });

  it("renders team-level use subsection", () => {
    render(<PlayGuide />);
    expect(
      screen.getByRole("heading", { name: /team.level use/i })
    ).toBeInTheDocument();
  });
});

describe("PlayGuide heading hierarchy", () => {
  it("uses h2 elements for major sections", () => {
    const { container } = render(<PlayGuide />);
    const h2s = container.querySelectorAll("h2");
    expect(h2s.length).toBeGreaterThanOrEqual(5);

    const h2Texts = Array.from(h2s).map((h) => h.textContent?.toLowerCase());
    expect(h2Texts).toEqual(
      expect.arrayContaining([
        expect.stringMatching(/structure/i),
        expect.stringMatching(/three ways to play/i),
        expect.stringMatching(/rituals/i),
        expect.stringMatching(/pairing/i),
        expect.stringMatching(/flavour/i),
      ])
    );
  });

  it("uses h3 elements for subsections within ways to play", () => {
    const { container } = render(<PlayGuide />);
    const h3s = container.querySelectorAll("h3");
    expect(h3s.length).toBeGreaterThanOrEqual(3);
  });

  it("does not skip heading levels (no h4 without h3, etc.)", () => {
    const { container } = render(<PlayGuide />);
    const headings = container.querySelectorAll("h1, h2, h3, h4, h5, h6");
    let maxLevel = 0;
    for (const heading of headings) {
      const level = parseInt(heading.tagName[1], 10);
      // Each heading level should not jump more than 1 level from previous max
      expect(level).toBeLessThanOrEqual(maxLevel + 1);
      if (level > maxLevel) maxLevel = level;
    }
  });
});

describe("PlayGuide tier indicators", () => {
  it("displays tier text labels for Open, Working, and Deep", () => {
    render(<PlayGuide />);
    expect(screen.getByText(/open/i, { selector: "strong, span, b, dt, th, li *" }) || screen.getByText(/open/i)).toBeTruthy();
    expect(screen.getByText(/working/i, { selector: "strong, span, b, dt, th, li *" }) || screen.getByText(/working/i)).toBeTruthy();
    expect(screen.getByText(/deep/i, { selector: "strong, span, b, dt, th, li *" }) || screen.getByText(/deep/i)).toBeTruthy();
  });

  it("does not rely solely on colour for tier differentiation", () => {
    render(<PlayGuide />);
    // All three tier names must appear as readable text
    const bodyText = document.body.textContent || "";
    expect(bodyText).toMatch(/open/i);
    expect(bodyText).toMatch(/working/i);
    expect(bodyText).toMatch(/deep/i);
  });
});

describe("PlayGuide content completeness", () => {
  it("mentions the four deck categories", () => {
    render(<PlayGuide />);
    const text = document.body.textContent || "";
    expect(text).toMatch(/infrastructure/i);
    expect(text).toMatch(/working together/i);
    expect(text).toMatch(/growth and direction/i);
    expect(text).toMatch(/feedback and repair/i);
  });

  it("mentions key rituals", () => {
    render(<PlayGuide />);
    const text = document.body.textContent || "";
    expect(text).toMatch(/permission/i);
    expect(text).toMatch(/closer/i);
    expect(text).toMatch(/save token/i);
    expect(text).toMatch(/etiquette/i);
  });
});
