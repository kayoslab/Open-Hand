import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Layout } from "../../src/ui/Layout/Layout";
import { Header } from "../../src/ui/Header/Header";
import { Nav } from "../../src/ui/Nav/Nav";

describe("Header component", () => {
  it("renders a <header> element", () => {
    render(<Header />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
  });

  it("displays the site title", () => {
    render(<Header />);
    expect(
      screen.getByRole("heading", { name: /open hand/i })
    ).toBeInTheDocument();
  });
});

describe("Nav component", () => {
  it("renders a <nav> element with aria-label", () => {
    render(<Nav />);
    const nav = screen.getByRole("navigation");
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute("aria-label");
  });

  it("renders expected navigation links", () => {
    render(<Nav />);
    const expectedLinks = ["Home", "Browse", "Play", "Guide"];
    for (const linkName of expectedLinks) {
      expect(
        screen.getByRole("link", { name: new RegExp(linkName, "i") })
      ).toBeInTheDocument();
    }
  });

  it("navigation links are focusable", () => {
    render(<Nav />);
    const links = screen.getAllByRole("link");
    for (const link of links) {
      expect(link).not.toHaveAttribute("tabindex", "-1");
    }
  });
});

describe("Layout component", () => {
  it("renders header region", () => {
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
