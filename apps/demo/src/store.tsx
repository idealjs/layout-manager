import {
  getLayouts,
  getPanels,
  getSplitters,
  ILayout,
  IPanel,
  ISplitter,
  LAYOUT_DIRECTION,
  LayoutNode,
  PanelNode,
  panelNodeToJSON,
} from "@idealjs/layout-manager";
import { createState } from "@idealjs/reactive";

export const splitters = createState<ISplitter[]>([]);
export const layouts = createState<ILayout[]>([]);
export const panels = createState<IPanel[]>([]);

export const setSplitters = (values: ISplitter[]) => {
  splitters.val = values;
};

export const setLayouts = (values: ILayout[]) => {
  layouts.val = values;
};

export const setPanels = (values: IPanel[]) => {
  panels.val = values;
};

const createLayout = (
  root = new LayoutNode({
    direction: LAYOUT_DIRECTION.ROOT,
  })
) => {
  const updateLayout = (
    rect: {
      height: number;
      width: number;
      left: number;
      top: number;
    } = {
      height: root.height,
      width: root.width,
      left: root.left,
      top: root.top,
    }
  ) => {
    root.shakeTree();
    rect && root.fill(rect);
    const layouts = getLayouts(root);
    const panels = getPanels(root);
    const splitters = getSplitters(root);

    setPanels(panels);
    setLayouts(layouts);
    setSplitters(splitters);
  };
  return {
    updateLayout,
    root,
  };
};

export const { root: RootLayout, updateLayout } = createLayout(
  new LayoutNode({
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
  })
);
