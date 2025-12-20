import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import TableOfContents from "@/components/table-of-contents/table-of-contents.tsx";


function setupTest(): void {
  const targetElement = document.createElement("div");
  targetElement.setAttribute("id", "target");
  targetElement.innerHTML = `
    <h1 id="section-1"> Section 1 </h1>
    <h2 id="section-1-1"> Section 1.1 </h2>
    <h3 id="section-1-1-1"> Section 1.1.1 </h3>
    <h4 id="section-1-1-1-1"> Section 1.1.1.1 </h4>
    <h2 id="section-1-2"> Section 1.2 </h2>
    <h1 id="section-2"> Section 2 </h1>
  `;
  document.body.appendChild(targetElement);
}


describe("TableOfContents", () => {
  setupTest();

  afterEach(() => {
    cleanup();
  });

  it("should build a model when the 'target-id' attribute is set", async () => {

    render(<TableOfContents targetQuerySelector="#target" />);

    const sectionOneLink = screen.getByRole("link", { name: "Section 1" });
    expect(sectionOneLink).toHaveProperty("href", "#section-1");

    const sectionOneOneLink = screen.getByRole("link", { name: "Section 1.1" });
    expect(sectionOneOneLink).toHaveProperty("href", "#section-1-1");

    const sectionOneOneOneLink = screen.getByRole("link", { name: "Section 1.1.1" });
    expect(sectionOneOneOneLink).toHaveProperty("href", "#section-1-1-1");

    const sectionOneOneOneOneLink = screen.getByRole("link", { name: "Section 1.1.1.1" });
    expect(sectionOneOneOneOneLink).toHaveProperty("href", "#section-1-1-1-1");

    const sectionOneTwoLink = screen.getByRole("link", { name: "Section 1.2" });
    expect(sectionOneTwoLink).toHaveProperty("href", "#section-1-2");

    const sectionTwoLink = screen.getByRole("link", { name: "Section 2" });
    expect(sectionTwoLink).toHaveProperty("href", "#section-2");
  });
});
