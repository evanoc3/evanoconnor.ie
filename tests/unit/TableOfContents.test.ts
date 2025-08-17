import { describe, it, expect } from "vitest";
import { type TableOfContentsModelNode } from "@/components/experiments/toc/TableOfContents";
import { nextEventLoop } from "../test-utils";


function setupTest(): void {
  const targetElement = document.createElement("div");
  targetElement.setAttribute("id", "target");
  targetElement.innerHTML = `
    <h1>Section 1</h1>
    <h2>Section 1.1</h2>
    <h3>Section 1.1.1</h3>
    <h4>Section 1.1.1.1</h4>
    <h2>Section 1.2</h2>
    <h1>Section 2</h1>
  `;
  document.body.appendChild(targetElement);
}


describe("TableOfContents", () => {
  setupTest();

  it("should build a model when the 'target-id' attribute is set", async () => {
    const tableOfContentsElement = document.createElement("eoc-toc");
    document.body.appendChild(tableOfContentsElement);
    expect(tableOfContentsElement).toHaveProperty("model", []);

    tableOfContentsElement.setAttribute("target-id", "target");
    await nextEventLoop();
    expect(tableOfContentsElement).toHaveProperty("model", [
      { headingType: 1, text: "Section 1", id: undefined, parent: undefined, depth: 0, children: [
        { headingType: 2, text: "Section 1.1", id: undefined, parent: expect.any(Object), depth: 1, children: [
          { headingType: 3, text: "Section 1.1.1", id: undefined, parent: expect.any(Object), depth: 2, children: [
            { headingType: 4, text: "Section 1.1.1.1", id: undefined, parent: expect.any(Object), depth: 3, children: [] }
          ]}
        ]},
        { headingType: 2, text: "Section 1.2", id: undefined, parent: expect.any(Object), depth: 1, children: [] }
      ]},
      { headingType: 1, text: "Section 2", id: undefined, parent: undefined, depth: 0, children: [] }
    ] as TableOfContentsModelNode[]);
  });
});
