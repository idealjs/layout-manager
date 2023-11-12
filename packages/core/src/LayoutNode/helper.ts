import PanelNode, { getPanel, IPanel, panelNodeToJSON } from "../PanelNode";
import LayoutNode from ".";
import { LAYOUT_DIRECTION, LayoutNodeActionType, MASK_PART } from "./enum";
import {
  AddPanelAction,
  AddPanelData,
  ILayout,
  ILayoutJSON,
  IRule,
  ISplitter,
  MovePanelAction,
  MovePanelData,
  MoveSplitterAction,
  MoveSplitterData,
  RemovePanelAction,
  RemovePanelData,
  SelectTabAction,
  SelectTabData,
} from "./type";

export const LRD = (
  layoutNode: LayoutNode,
  t: (layout: LayoutNode) => void
) => {
  for (let index = 0; index < layoutNode.layoutNodes.length; index++) {
    LRD(layoutNode.layoutNodes[index], t);
  }
  t(layoutNode);
};

export const RLD = (
  layoutNode: LayoutNode,
  t: (layout: LayoutNode) => void
) => {
  layoutNode.layoutNodes.reduceRight((p, childNode) => {
    RLD(childNode, t);
    return undefined;
  }, undefined);

  t(layoutNode);
};

export const findLayoutNode = (
  layoutNode: LayoutNode,
  predicate: (layoutNode: LayoutNode, level: number) => boolean,
  level = 0
): LayoutNode | null => {
  if (predicate(layoutNode, level)) {
    return layoutNode;
  }

  return layoutNode.layoutNodes.reduce(
    (p: LayoutNode | null, c: LayoutNode) => {
      return p != null ? p : findLayoutNode(c, predicate, level + 1);
    },
    null
  );
};

export const getLayoutById = (layoutNode: LayoutNode, id: string) => {
  return findLayoutNode(layoutNode, (n) => n.id === id);
};

export const isValid = (layoutNode: LayoutNode): boolean => {
  const includes =
    layoutNode.direction === LAYOUT_DIRECTION.ROOT
      ? true
      : layoutNode.parent?.layoutNodes.includes(layoutNode);
  const childrenValidation = layoutNode.layoutNodes.reduce((p, c) => {
    if (c.direction === LAYOUT_DIRECTION.TAB) {
      return isValid(c) && c.panelNodes.length !== 0 && p;
    }
    return isValid(c) && p;
  }, true);
  return childrenValidation && (includes != null ? includes : false);
};

export const findPanelNode = (
  layoutNode: LayoutNode,
  predicate: (panelNode: PanelNode) => boolean
): PanelNode | null => {
  let result = layoutNode.panelNodes.reduce(
    (p: PanelNode | null, c: PanelNode) => {
      if (predicate(c)) {
        return c;
      }
      return p;
    },
    null
  );
  if (result != null) {
    return result;
  }

  return layoutNode.layoutNodes.reduce((p: PanelNode | null, c: LayoutNode) => {
    return p != null ? p : findPanelNode(c, predicate);
  }, null);
};

export const layoutNodeToJSON = (layoutNode: LayoutNode): ILayoutJSON => {
  return {
    id: layoutNode.id,
    direction: layoutNode.direction,
    primaryOffset: layoutNode.primaryOffset,
    secondaryOffset: layoutNode.secondaryOffset,
    layouts: layoutNode.layoutNodes.map((n) => layoutNodeToJSON(n)),
    panels: layoutNode.panelNodes.map((n) => panelNodeToJSON(n)),
  };
};

export const getPanelById = (layoutNode: LayoutNode, id: string) => {
  return findPanelNode(layoutNode, (n) => n.id === id);
};

export const getLayouts = (layoutNode: LayoutNode): ILayout[] => {
  if (layoutNode.direction === LAYOUT_DIRECTION.TAB) {
    if (
      !layoutNode.panelNodes.map((c) => c.selected).includes(true) &&
      layoutNode.panelNodes.length > 0
    ) {
      layoutNode.panelNodes[0].selected = true;
    }
  }
  const layout: ILayout = {
    id: layoutNode.id,
    height: layoutNode.height,
    width: layoutNode.width,
    left: layoutNode.left,
    top: layoutNode.top,
    primaryOffset: layoutNode.primaryOffset,
    secondaryOffset: layoutNode.secondaryOffset,
    parentId: layoutNode.parent?.id,
    children:
      layoutNode.direction !== LAYOUT_DIRECTION.TAB
        ? layoutNode.layoutNodes.map((node) => node.id)
        : layoutNode.panelNodes.map((node) => node.id),
    direction: layoutNode.direction,
  };
  return layoutNode.layoutNodes
    .flatMap((node) => getLayouts(node))
    .concat(layout);
};

export const getPanels = (layoutNode: LayoutNode): IPanel[] => {
  return layoutNode.layoutNodes
    .flatMap((node) => getPanels(node))
    .concat(layoutNode.panelNodes.map((pChild) => getPanel(pChild)));
};

export const getSplitters = (layoutNode: LayoutNode): ISplitter[] => {
  const index = layoutNode.parent?.layoutNodes.findIndex(
    (node) => node === layoutNode
  );
  if (
    layoutNode.parent == null ||
    index == null ||
    index === -1 ||
    index === layoutNode.parent.layoutNodes.length - 1
  ) {
    return layoutNode.layoutNodes.flatMap((node) => getSplitters(node));
  }

  let splitterHeight = 0;
  let splitterWidth = 0;
  let splitterLeft = 0;
  let splitterTop = 0;

  if (layoutNode.parent.direction === LAYOUT_DIRECTION.COL) {
    splitterWidth = layoutNode.parent.width;
    splitterLeft = layoutNode.parent.left;
    splitterTop = layoutNode.top + layoutNode.height;
  }

  if (layoutNode.parent.direction === LAYOUT_DIRECTION.ROW) {
    splitterHeight = layoutNode.parent.height;
    splitterLeft = layoutNode.left + layoutNode.width;
    splitterTop = layoutNode.parent.top;
  }

  const splitter: ISplitter = {
    id: `${layoutNode.parent.id}_${layoutNode.id}_${
      layoutNode.parent.layoutNodes[index + 1].id
    }`,
    height: splitterHeight,
    width: splitterWidth,
    left: splitterLeft,
    top: splitterTop,
    primaryId: layoutNode.id,
    secondaryId: layoutNode.parent.layoutNodes[index + 1].id,
    parentId: layoutNode.parent.id,
  };

  return layoutNode.layoutNodes
    .flatMap((node) => getSplitters(node))
    .concat(splitter);
};

export const findNodeByRules = (
  layoutNode: LayoutNode,
  rules: IRule[]
): {
  layoutNode: LayoutNode;
  rule: IRule;
} | null => {
  return rules.reduce(
    (
      result: {
        layoutNode: LayoutNode;
        rule: IRule;
      } | null,
      rule: IRule,
      index
    ) => {
      const direction = directionFromMask(rule.part);
      if (result != null) {
        return result;
      }
      const found = findLayoutNode(layoutNode, (l, level) => {
        if (
          direction === LAYOUT_DIRECTION.TAB &&
          direction === l.direction &&
          l.panelNodes.length < rule.max
        ) {
          if (rule.limitLevel != null) {
            if (rule.limitLevel >= level - 1) {
              return true;
            }
          } else {
            return true;
          }
        }

        if (direction !== LAYOUT_DIRECTION.TAB) {
          if (
            l.direction === direction &&
            l.layoutNodes.length < rule.max &&
            level - 1 <= index
          ) {
            if (rule.limitLevel != null) {
              if (rule.limitLevel >= level - 1) {
                return true;
              }
            } else {
              return true;
            }
          }
          if (l.direction !== direction && level - 1 === index) {
            if (rule.limitLevel != null) {
              if (rule.limitLevel >= level - 1) {
                return true;
              }
            } else {
              return true;
            }
          }
        }

        return false;
      });
      if (found == null) {
        return null;
      }
      return {
        layoutNode: found,
        rule: rule,
      };
    },
    null
  );
};

export const directionFromMask = (mask: MASK_PART): LAYOUT_DIRECTION => {
  switch (mask) {
    case MASK_PART.CENTER:
      return LAYOUT_DIRECTION.TAB;
    case MASK_PART.RIGHT:
      return LAYOUT_DIRECTION.ROW;
    case MASK_PART.LEFT:
      return LAYOUT_DIRECTION.ROW;
    case MASK_PART.TOP:
      return LAYOUT_DIRECTION.COL;
    case MASK_PART.BOTTOM:
      return LAYOUT_DIRECTION.COL;
    default:
      throw new Error("");
  }
};

export const createAddPanelAction = (payload: AddPanelData): AddPanelAction => {
  return {
    type: LayoutNodeActionType.ADD_PANEL,
    payload,
  };
};

export const createMovePanelAction = (
  payload: MovePanelData
): MovePanelAction => {
  return {
    type: LayoutNodeActionType.MOVE_PANEL,
    payload,
  };
};

export const createMoveSplitterAction = (
  payload: MoveSplitterData
): MoveSplitterAction => {
  return {
    type: LayoutNodeActionType.MOVE_SPLITTER,
    payload,
  };
};

export const createRemovePanelAction = (
  payload: RemovePanelData
): RemovePanelAction => {
  return {
    type: LayoutNodeActionType.REMOVE_PANEL,
    payload,
  };
};

export const createSelectTabAction = (
  payload: SelectTabData
): SelectTabAction => {
  return {
    type: LayoutNodeActionType.SELECT_TAB,
    payload,
  };
};
