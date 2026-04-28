import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Layout } from "../../src/ui/Layout/Layout";
import { Nav } from "../../src/ui/Nav/Nav";

describe("Nav component", () => {
  it("renders a <header> element (banner role)", () => {
    render(<Nav />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders a <nav> element with aria-label", () => {
    render(<Nav />);
    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute("aria-label");
  });

  it("renders expected navigation links", () => {
    render(<Nav />);
    const expectedLinks = ["The Deck", "How It Works", "For Teams", "Resources", "About"];
    for (const linkName of expectedLinks) {
      expect(
        screen.getByRole("link", { name: new RegExp(linkName, "i") })
      ).toBeInTheDocument();
    }
  });

  it("renders a CTA link", () => {
    render(<Nav />);
    expect(
      screen.getByRole("link", { name: /get your deck/i })
    ).toBeInTheDocument();
  });

  it("navigation links are focusable", () => {
    render(<Nav />);
    const nav = screen.getByRole("navigation");
    const links = Array.from(nav.querySelectorAll("a"));
    for (const link of links) {
      expect(link).not.toHaveAttribute("tabindex", "-1");
    }
  });
});

describe("Layout component", () => {
  it("renders banner region", () => {
    render(<Layout>content</Layout>);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("renders navigation region", () => {
    render(<Layout>content</Layout>);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });

  it("renders main content region", () => {
    render(<Layout>content</Layout>);
    expect(screen.getByRole("main")).toBeInTheDocument();
  });

  it("renders children inside main content area", () => {
    render(<Layout><p>Test child content</p></Layout>);
    const main = screen.getByRole("main");
    expect(main).toHaveTextContent("Test child content");
  });

  it("renders all three semantic regions together", () => {
    render(<Layout>content</Layout>);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
  });
});
