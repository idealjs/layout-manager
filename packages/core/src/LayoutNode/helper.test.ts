import { describe, expect, it, vi } from "vitest";

import LayoutNode from ".";
import { LAYOUT_DIRECTION } from "./enum";
import { layoutNodeToJSON, LRD, RLD } from "./helper";

describe("LRD", () => {
  it("Should be called. From the last element.", () => {
    const stack: string[] = [];
    const stub = vi.fn((layoutNode: LayoutNode) => {
      stack.push(layoutNodeToJSON(layoutNode).id);
    });
    const layoutNode = new LayoutNode({
      id: "root",
      direction: LAYOUT_DIRECTION.ROOT,
      layouts: [
        {
          id: "col-layout",
          direction: LAYOUT_DIRECTION.COL,
          layouts: [
            {
              id: "tab-layout-1",
              direction: LAYOUT_DIRECTION.TAB,
              panels: [{}],
            },
            {
              id: "tab-layout-2",
              direction: LAYOUT_DIRECTION.TAB,
              panels: [{}],
            },
          ],
        },
      ],
    });
    LRD(layoutNode, stub);
    expect(stub).toHaveBeenCalledTimes(4);
    expect(stack).toMatchInlineSnapshot(`
      [
        "tab-layout-1",
        "tab-layout-2",
        "col-layout",
        "root",
      ]
    `);
  });
});

describe("RLD", () => {
  it("Should be called. From the first element.", () => {
    const stack: string[] = [];
    const stub = vi.fn((layoutNode: LayoutNode) => {
      stack.push(layoutNodeToJSON(layoutNode).id);
    });
    const layoutNode = new LayoutNode({
      id: "root",
      direction: LAYOUT_DIRECTION.ROOT,
      layouts: [
        {
          id: "tab-layout",
          direction: LAYOUT_DIRECTION.COL,
          layouts: [
            {
              id: "tab-layout-1",
              direction: LAYOUT_DIRECTION.TAB,
              panels: [{}],
            },
            {
              id: "tab-layout-2",
              direction: LAYOUT_DIRECTION.TAB,
              panels: [{}],
            },
          ],
        },
      ],
    });
    RLD(layoutNode, stub);
    expect(stub).toHaveBeenCalledTimes(4);
    expect(stack).toMatchInlineSnapshot(`
      [
        "tab-layout-2",
        "tab-layout-1",
        "tab-layout",
        "root",
      ]
    `);
  });
});

// describe("findLayoutNode", () => {});

// describe("getLayoutById", () => {});

// describe("isValid", () => {});

// describe("findPanelNode", () => {});

// describe("layoutNodeToJSON", () => {});

// describe("getPanelById", () => {});

// describe("getLayouts", () => {});

// describe("getPanels", () => {});

// describe("getSplitters", () => {});

// describe("findNodeByRules", () => {});

// describe("directionFromMask", () => {});

// describe("createAddPanelAction", () => {});

// describe("createMovePanelAction", () => {});

// describe("createMoveSplitterAction", () => {});

// describe("createRemovePanelAction", () => {});

// describe("createSelectTabAction", () => {});
