import { describe, expect, it, vi } from "vitest";

import PanelNode, { panelNodeToJSON } from "../PanelNode";
import LayoutNode from ".";
import { LAYOUT_DIRECTION, MASK_PART } from "./enum";
import {
  createAddPanelAction,
  createMovePanelAction,
  createMoveSplitterAction,
  findNodeByRules,
  isValid,
} from "./helper";

vi.mock("nanoid", () => {
  let count = 1;
  return {
    nanoid: () => count++,
  };
});

describe("LayoutNode", () => {
  it("LayoutNode Simple Test", () => {
    // Create Root Layout
    const layoutNode = new LayoutNode({
      id: "mockRoot",
      direction: LAYOUT_DIRECTION.ROOT,
    });
    layoutNode.fill({
      height: 300,
      width: 400,
      top: 0,
      left: 0,
    });
    expect(layoutNode).toMatchInlineSnapshot(`
      LayoutNode {
        "direction": "ROOT",
        "height": 300,
        "id": "mockRoot",
        "layoutNodes": [],
        "left": 0,
        "panelNodes": [],
        "parent": null,
        "primaryOffset": 0,
        "secondaryOffset": 0,
        "top": 0,
        "width": 400,
      }
    `);
    expect(isValid(layoutNode)).toBe(true);

    // Add Two Panel
    layoutNode.doAction(
      createAddPanelAction({
        panelNode: new PanelNode({
          id: "panel-1",
        }),
        mask: MASK_PART.LEFT,
        target: "mockRoot",
      })
    );

    layoutNode.doAction(
      createAddPanelAction({
        panelNode: new PanelNode({
          id: "panel-2",
        }),
        mask: MASK_PART.LEFT,
        target: "mockRoot",
      })
    );
    layoutNode.fill({
      height: 300,
      width: 400,
      top: 0,
      left: 0,
    });
    layoutNode.shakeTree();
    expect(layoutNode).toMatchInlineSnapshot(`
      LayoutNode {
        "direction": "ROOT",
        "height": 300,
        "id": "mockRoot",
        "layoutNodes": [
          LayoutNode {
            "direction": "ROW",
            "height": 300,
            "id": 8,
            "layoutNodes": [
              LayoutNode {
                "direction": "TAB",
                "height": 300,
                "id": 7,
                "layoutNodes": [],
                "left": 0,
                "panelNodes": [
                  PanelNode {
                    "id": "panel-2",
                    "page": "",
                    "parent": [Circular],
                    "selected": true,
                  },
                ],
                "parent": [Circular],
                "primaryOffset": 0,
                "secondaryOffset": 0,
                "top": 0,
                "width": 200,
              },
              LayoutNode {
                "direction": "TAB",
                "height": 300,
                "id": 4,
                "layoutNodes": [],
                "left": 200,
                "panelNodes": [
                  PanelNode {
                    "id": "panel-1",
                    "page": "",
                    "parent": [Circular],
                    "selected": true,
                  },
                ],
                "parent": [Circular],
                "primaryOffset": 0,
                "secondaryOffset": 0,
                "top": 0,
                "width": 100,
              },
            ],
            "left": 0,
            "panelNodes": [],
            "parent": [Circular],
            "primaryOffset": 0,
            "secondaryOffset": 0,
            "top": 0,
            "width": 400,
          },
        ],
        "left": 0,
        "panelNodes": [],
        "parent": null,
        "primaryOffset": 0,
        "secondaryOffset": 0,
        "top": 0,
        "width": 400,
      }
    `);
    expect(isValid(layoutNode)).toBe(true);

    // Move Panel
    layoutNode.doAction(
      createMovePanelAction({
        search: "panel-2",
        target: "panel-1",
        mask: MASK_PART.BOTTOM,
      })
    );
    layoutNode.fill({
      height: 300,
      width: 400,
      top: 0,
      left: 0,
    });
    layoutNode.shakeTree();
    expect(layoutNode).toMatchInlineSnapshot(`
      LayoutNode {
        "direction": "ROOT",
        "height": 300,
        "id": "mockRoot",
        "layoutNodes": [
          LayoutNode {
            "direction": "COL",
            "height": 300,
            "id": 10,
            "layoutNodes": [
              LayoutNode {
                "direction": "TAB",
                "height": 150,
                "id": 4,
                "layoutNodes": [],
                "left": 200,
                "panelNodes": [
                  PanelNode {
                    "id": "panel-1",
                    "page": "",
                    "parent": [Circular],
                    "selected": true,
                  },
                ],
                "parent": [Circular],
                "primaryOffset": 0,
                "secondaryOffset": 0,
                "top": 0,
                "width": 200,
              },
              LayoutNode {
                "direction": "TAB",
                "height": 150,
                "id": 9,
                "layoutNodes": [],
                "left": 200,
                "panelNodes": [
                  PanelNode {
                    "id": "panel-2",
                    "page": "",
                    "parent": [Circular],
                    "selected": true,
                  },
                ],
                "parent": [Circular],
                "primaryOffset": 0,
                "secondaryOffset": 0,
                "top": 150,
                "width": 200,
              },
            ],
            "left": 200,
            "panelNodes": [],
            "parent": [Circular],
            "primaryOffset": 0,
            "secondaryOffset": 0,
            "top": 0,
            "width": 200,
          },
        ],
        "left": 0,
        "panelNodes": [],
        "parent": null,
        "primaryOffset": 0,
        "secondaryOffset": 0,
        "top": 0,
        "width": 400,
      }
    `);
    expect(isValid(layoutNode)).toBe(true);

    // Move Splitter
    layoutNode.doAction(
      createMoveSplitterAction({
        primary: "panel-1",
        secondary: "panel-2",
        offset: 20,
      })
    );
    layoutNode.fill({
      height: 300,
      width: 400,
      top: 0,
      left: 0,
    });
    layoutNode.shakeTree();

    expect(layoutNode).toMatchInlineSnapshot(`
      LayoutNode {
        "direction": "ROOT",
        "height": 300,
        "id": "mockRoot",
        "layoutNodes": [
          LayoutNode {
            "direction": "COL",
            "height": 300,
            "id": 10,
            "layoutNodes": [
              LayoutNode {
                "direction": "TAB",
                "height": 170,
                "id": 4,
                "layoutNodes": [],
                "left": 0,
                "panelNodes": [
                  PanelNode {
                    "id": "panel-1",
                    "page": "",
                    "parent": [Circular],
                    "selected": true,
                  },
                ],
                "parent": [Circular],
                "primaryOffset": 0,
                "secondaryOffset": 20,
                "top": 0,
                "width": 400,
              },
              LayoutNode {
                "direction": "TAB",
                "height": 130,
                "id": 9,
                "layoutNodes": [],
                "left": 0,
                "panelNodes": [
                  PanelNode {
                    "id": "panel-2",
                    "page": "",
                    "parent": [Circular],
                    "selected": true,
                  },
                ],
                "parent": [Circular],
                "primaryOffset": -20,
                "secondaryOffset": 0,
                "top": 170,
                "width": 400,
              },
            ],
            "left": 0,
            "panelNodes": [],
            "parent": [Circular],
            "primaryOffset": 0,
            "secondaryOffset": 0,
            "top": 0,
            "width": 400,
          },
        ],
        "left": 0,
        "panelNodes": [],
        "parent": null,
        "primaryOffset": 0,
        "secondaryOffset": 0,
        "top": 0,
        "width": 400,
      }
    `);
    expect(isValid(layoutNode)).toBe(true);
    expect(layoutNode.layoutNodes[0].layoutNodes[0].height).toBe(170);
    expect(layoutNode.layoutNodes[0].layoutNodes[1].height).toBe(130);
  });

  it("LayoutNode With Two Panel Test", () => {
    // Create Root Layout With Two Panel
    const layoutNode = new LayoutNode({
      id: "mockRoot",
      direction: LAYOUT_DIRECTION.ROOT,
      layouts: [
        {
          direction: LAYOUT_DIRECTION.ROW,
          layouts: [
            {
              direction: LAYOUT_DIRECTION.TAB,
              panels: [
                {
                  id: "panel-1",
                  page: "test",
                },
              ],
            },
            {
              direction: LAYOUT_DIRECTION.TAB,
              panels: [
                {
                  id: "panel-2",
                  page: "test",
                },
              ],
            },
          ],
        },
      ],
    });
    layoutNode.fill({
      height: 300,
      width: 400,
      top: 0,
      left: 0,
    });

    expect(layoutNode).toMatchInlineSnapshot(`
      LayoutNode {
        "direction": "ROOT",
        "height": 300,
        "id": "mockRoot",
        "layoutNodes": [
          LayoutNode {
            "direction": "ROW",
            "height": 300,
            "id": 12,
            "layoutNodes": [
              LayoutNode {
                "direction": "TAB",
                "height": 300,
                "id": 13,
                "layoutNodes": [],
                "left": 0,
                "panelNodes": [
                  PanelNode {
                    "id": "panel-1",
                    "page": "test",
                    "parent": [Circular],
                    "selected": true,
                  },
                ],
                "parent": [Circular],
                "primaryOffset": 0,
                "secondaryOffset": 0,
                "top": 0,
                "width": 200,
              },
              LayoutNode {
                "direction": "TAB",
                "height": 300,
                "id": 15,
                "layoutNodes": [],
                "left": 200,
                "panelNodes": [
                  PanelNode {
                    "id": "panel-2",
                    "page": "test",
                    "parent": [Circular],
                    "selected": true,
                  },
                ],
                "parent": [Circular],
                "primaryOffset": 0,
                "secondaryOffset": 0,
                "top": 0,
                "width": 200,
              },
            ],
            "left": 0,
            "panelNodes": [],
            "parent": [Circular],
            "primaryOffset": 0,
            "secondaryOffset": 0,
            "top": 0,
            "width": 400,
          },
        ],
        "left": 0,
        "panelNodes": [],
        "parent": null,
        "primaryOffset": 0,
        "secondaryOffset": 0,
        "top": 0,
        "width": 400,
      }
    `);
    expect(isValid(layoutNode)).toBe(true);

    // Move Panel
    layoutNode.doAction(
      createMovePanelAction({
        search: "panel-2",
        target: "panel-1",
        mask: MASK_PART.BOTTOM,
      })
    );
    layoutNode.shakeTree();
    layoutNode.fill({
      height: 300,
      width: 400,
      top: 0,
      left: 0,
    });
    expect(layoutNode).toMatchInlineSnapshot(`
      LayoutNode {
        "direction": "ROOT",
        "height": 300,
        "id": "mockRoot",
        "layoutNodes": [
          LayoutNode {
            "direction": "COL",
            "height": 300,
            "id": 18,
            "layoutNodes": [
              LayoutNode {
                "direction": "TAB",
                "height": 150,
                "id": 13,
                "layoutNodes": [],
                "left": 0,
                "panelNodes": [
                  PanelNode {
                    "id": "panel-1",
                    "page": "test",
                    "parent": [Circular],
                    "selected": true,
                  },
                ],
                "parent": [Circular],
                "primaryOffset": 0,
                "secondaryOffset": 0,
                "top": 0,
                "width": 400,
              },
              LayoutNode {
                "direction": "TAB",
                "height": 150,
                "id": 17,
                "layoutNodes": [],
                "left": 0,
                "panelNodes": [
                  PanelNode {
                    "id": "panel-2",
                    "page": "test",
                    "parent": [Circular],
                    "selected": true,
                  },
                ],
                "parent": [Circular],
                "primaryOffset": 0,
                "secondaryOffset": 0,
                "top": 150,
                "width": 400,
              },
            ],
            "left": 0,
            "panelNodes": [],
            "parent": [Circular],
            "primaryOffset": 0,
            "secondaryOffset": 0,
            "top": 0,
            "width": 400,
          },
        ],
        "left": 0,
        "panelNodes": [],
        "parent": null,
        "primaryOffset": 0,
        "secondaryOffset": 0,
        "top": 0,
        "width": 400,
      }
    `);
    expect(isValid(layoutNode)).toBe(true);

    // Move Splitter
    layoutNode.doAction(
      createMoveSplitterAction({
        primary: "panel-1",
        secondary: "panel-2",
        offset: 20,
      })
    );
    layoutNode.shakeTree();
    layoutNode.fill({
      height: 300,
      width: 400,
      top: 0,
      left: 0,
    });

    expect(layoutNode).toMatchInlineSnapshot(`
      LayoutNode {
        "direction": "ROOT",
        "height": 300,
        "id": "mockRoot",
        "layoutNodes": [
          LayoutNode {
            "direction": "COL",
            "height": 300,
            "id": 18,
            "layoutNodes": [
              LayoutNode {
                "direction": "TAB",
                "height": 170,
                "id": 13,
                "layoutNodes": [],
                "left": 0,
                "panelNodes": [
                  PanelNode {
                    "id": "panel-1",
                    "page": "test",
                    "parent": [Circular],
                    "selected": true,
                  },
                ],
                "parent": [Circular],
                "primaryOffset": 0,
                "secondaryOffset": 20,
                "top": 0,
                "width": 400,
              },
              LayoutNode {
                "direction": "TAB",
                "height": 130,
                "id": 17,
                "layoutNodes": [],
                "left": 0,
                "panelNodes": [
                  PanelNode {
                    "id": "panel-2",
                    "page": "test",
                    "parent": [Circular],
                    "selected": true,
                  },
                ],
                "parent": [Circular],
                "primaryOffset": -20,
                "secondaryOffset": 0,
                "top": 170,
                "width": 400,
              },
            ],
            "left": 0,
            "panelNodes": [],
            "parent": [Circular],
            "primaryOffset": 0,
            "secondaryOffset": 0,
            "top": 0,
            "width": 400,
          },
        ],
        "left": 0,
        "panelNodes": [],
        "parent": null,
        "primaryOffset": 0,
        "secondaryOffset": 0,
        "top": 0,
        "width": 400,
      }
    `);
    expect(isValid(layoutNode)).toBe(true);
    expect(layoutNode.layoutNodes[0].layoutNodes[0].height).toBe(170);
    expect(layoutNode.layoutNodes[0].layoutNodes[1].height).toBe(130);
  });

  it("LayoutNode Default Panel - Add Panel to Right", () => {
    const layoutNode = new LayoutNode({
      direction: LAYOUT_DIRECTION.ROOT,
      layouts: [
        {
          direction: LAYOUT_DIRECTION.ROW,
          layouts: [
            {
              direction: LAYOUT_DIRECTION.TAB,
              panels: [panelNodeToJSON(new PanelNode())],
            },
          ],
        },
      ],
    });

    layoutNode.fill({
      height: 300,
      width: 400,
      top: 0,
      left: 0,
    });

    const target = findNodeByRules(layoutNode, [
      { part: MASK_PART.BOTTOM, max: 2 },
      { part: MASK_PART.RIGHT, max: 2 },
      { part: MASK_PART.TOP, max: 3, limitLevel: 1 },
      { part: MASK_PART.CENTER, max: 2 },
    ]);
    if (target != null) {
      layoutNode.doAction(
        createAddPanelAction({
          panelNode: new PanelNode(),
          mask: MASK_PART.LEFT,
          target: target?.layoutNode.id,
        })
      );
    }
    layoutNode.shakeTree();
    layoutNode.fill({
      height: 300,
      width: 400,
      top: 0,
      left: 0,
    });

    expect(layoutNode).toMatchInlineSnapshot(`
      LayoutNode {
        "direction": "ROOT",
        "height": 300,
        "id": 20,
        "layoutNodes": [
          LayoutNode {
            "direction": "ROW",
            "height": 300,
            "id": 26,
            "layoutNodes": [
              LayoutNode {
                "direction": "TAB",
                "height": 300,
                "id": 25,
                "layoutNodes": [],
                "left": 0,
                "panelNodes": [
                  PanelNode {
                    "id": 24,
                    "page": "",
                    "parent": [Circular],
                    "selected": true,
                  },
                ],
                "parent": [Circular],
                "primaryOffset": 0,
                "secondaryOffset": 0,
                "top": 0,
                "width": 200,
              },
              LayoutNode {
                "direction": "TAB",
                "height": 300,
                "id": 22,
                "layoutNodes": [],
                "left": 200,
                "panelNodes": [
                  PanelNode {
                    "id": 19,
                    "page": "",
                    "parent": [Circular],
                    "selected": true,
                  },
                ],
                "parent": [Circular],
                "primaryOffset": 0,
                "secondaryOffset": 0,
                "top": 0,
                "width": 200,
              },
            ],
            "left": 0,
            "panelNodes": [],
            "parent": [Circular],
            "primaryOffset": 0,
            "secondaryOffset": 0,
            "top": 0,
            "width": 400,
          },
        ],
        "left": 0,
        "panelNodes": [],
        "parent": null,
        "primaryOffset": 0,
        "secondaryOffset": 0,
        "top": 0,
        "width": 400,
      }
    `);
    expect(isValid(layoutNode)).toBe(true);
  });
});
