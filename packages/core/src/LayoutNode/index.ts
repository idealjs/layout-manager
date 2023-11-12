import { nanoid } from "nanoid";

import PanelNode from "../PanelNode";
import { LAYOUT_DIRECTION, LayoutNodeActionType, MASK_PART } from "./enum";
import {
  directionFromMask,
  findLayoutNode,
  findPanelNode,
  getPanelById,
  RLD,
} from "./helper";
import type {
  AddPanelAction,
  AddPanelData,
  ILayoutJSON,
  MovePanelAction,
  MovePanelData,
  MoveSplitterAction,
  MoveSplitterData,
  RecursivePartialPanelJSON,
  RecursivePartialWithRequired,
  RemovePanelAction,
  RemovePanelData,
  SelectTabAction,
  SelectTabData,
} from "./type";
import {
  is_ADD_PANEL_DATA,
  is_MOVE_PANEL_DATA,
  is_MOVE_SPLITTER_DATA,
  is_REMOVE_PANEL_DATA,
  is_SELECT_TAB_DATA,
} from "./typeGuard";

export const LayoutNodeUpdate = Symbol("LayoutNodeUpdate");

class LayoutNode {
  id: string = nanoid();
  height: number = 0;
  width: number = 0;
  left: number = 0;
  top: number = 0;
  primaryOffset: number = 0;
  secondaryOffset: number = 0;
  layoutNodes: LayoutNode[] = [];
  panelNodes: PanelNode[] = [];

  direction: LAYOUT_DIRECTION;
  parent: LayoutNode | null = null;

  constructor(
    layoutJSON: RecursivePartialWithRequired<
      RecursivePartialPanelJSON<ILayoutJSON>,
      "direction"
    >
  ) {
    this.direction = layoutJSON.direction ?? LAYOUT_DIRECTION.TAB;
    if (layoutJSON.id != null) {
      this.id = layoutJSON.id;
    }
    if (layoutJSON.primaryOffset != null) {
      this.primaryOffset = layoutJSON.primaryOffset;
    }
    if (layoutJSON.secondaryOffset != null) {
      this.secondaryOffset = layoutJSON.secondaryOffset;
    }
    if (layoutJSON.layouts != null && layoutJSON.layouts.length !== 0) {
      this.appendLayoutNode(
        ...layoutJSON.layouts.map((layoutJSON) => new LayoutNode(layoutJSON))
      );
    }
    if (layoutJSON.panels != null && layoutJSON.panels.length !== 0) {
      this.appendPanelNode(
        ...layoutJSON.panels.map((panelJSON) => new PanelNode(panelJSON))
      );
    }
  }

  public doAction(action: AddPanelAction): void;
  public doAction(action: MovePanelAction): void;
  public doAction(action: MoveSplitterAction): void;
  public doAction(action: RemovePanelAction): void;
  public doAction(action: SelectTabAction): void;

  public doAction(
    action:
      | AddPanelAction
      | MovePanelAction
      | MoveSplitterAction
      | RemovePanelAction
      | SelectTabAction
  ) {
    const { type, payload } = action;
    switch (type) {
      case LayoutNodeActionType.ADD_PANEL:
        if (is_ADD_PANEL_DATA(payload)) {
          this.addPanelNode(payload);
        }
        break;
      case LayoutNodeActionType.MOVE_PANEL:
        if (is_MOVE_PANEL_DATA(payload)) {
          this.movePanelNode(payload);
        }
        break;
      case LayoutNodeActionType.MOVE_SPLITTER:
        if (is_MOVE_SPLITTER_DATA(payload)) {
          this.moveSplitter(payload);
        }
        break;
      case LayoutNodeActionType.REMOVE_PANEL:
        if (is_REMOVE_PANEL_DATA(payload)) {
          this.removePanelNode(payload);
        }
        break;
      case LayoutNodeActionType.SELECT_TAB:
        if (is_SELECT_TAB_DATA(payload)) {
          this.selectTab(payload);
        }
        break;
      default:
        break;
    }
  }

  private appendLayoutNode(...children: LayoutNode[]) {
    this.layoutNodes = this.layoutNodes.concat(children);
    children.forEach((c) => (c.parent = this));
    return this;
  }

  private appendPanelNode(...children: PanelNode[]) {
    if (this.direction === LAYOUT_DIRECTION.TAB) {
      this.panelNodes = this.panelNodes.concat(children);
      children.forEach((c) => {
        c.parent = this;
      });
    } else {
      console.debug("[Debug]", this.id);
      throw new Error("Can't appendPanelNode to none tab layout");
    }
    if (!this.panelNodes.map((c) => c.selected).includes(true)) {
      this.panelNodes[0].selected = true;
    }
    return this;
  }

  private removeChild(oldChild: LayoutNode) {
    const index = this.layoutNodes.findIndex((c) => c === oldChild);
    if (index !== -1) {
      const primaryNode = this.layoutNodes[index - 1];
      const secondaryNode = this.layoutNodes[index + 1];
      if (primaryNode) {
        primaryNode.secondaryOffset =
          primaryNode.secondaryOffset + oldChild.primaryOffset;
      }
      if (secondaryNode) {
        secondaryNode.primaryOffset =
          secondaryNode.primaryOffset + oldChild.secondaryOffset;
      }
      this.layoutNodes.splice(index, 1);
      oldChild.parent = null;
    }
    return this;
  }

  private replaceChild(newChild: LayoutNode, oldChild: LayoutNode) {
    const index = this.layoutNodes.findIndex((c) => c === oldChild);
    if (index !== -1) {
      const primaryNode = this.layoutNodes[index - 1];
      const secondaryNode = this.layoutNodes[index + 1];
      if (primaryNode) {
        newChild.primaryOffset = oldChild.primaryOffset;
      }
      if (secondaryNode) {
        newChild.secondaryOffset = oldChild.secondaryOffset;
      }
      this.layoutNodes[index] = newChild;
      newChild.parent = oldChild.parent;
      oldChild.parent = null;
    }
    return this;
  }

  public fill(rect: {
    height: number;
    width: number;
    left: number;
    top: number;
  }) {
    this.height = rect.height;
    this.width = rect.width;
    this.left = rect.left;
    this.top = rect.top;

    if (
      this.direction !== LAYOUT_DIRECTION.TAB &&
      this.layoutNodes.length !== 0
    ) {
      let childHeight = 0;
      let childWidth = 0;
      let childLeft = 0;
      let childTop = 0;

      let avgHeight = 0;
      let avgWidth = 0;

      this.layoutNodes.forEach((node, currentIndex) => {
        if (this.direction === LAYOUT_DIRECTION.ROOT) {
          childHeight = this.height;
          childWidth = this.width;
          childLeft = this.left;
          childTop = this.top;
        }
        if (this.direction === LAYOUT_DIRECTION.COL) {
          avgHeight = rect.height / this.layoutNodes.length;
          avgWidth = rect.width;

          childHeight = avgHeight + (node.primaryOffset + node.secondaryOffset);

          childWidth = avgWidth;
          childLeft = rect.left;
          childTop = currentIndex * avgHeight + rect.top - node.primaryOffset;
        }

        if (this.direction === LAYOUT_DIRECTION.ROW) {
          avgHeight = rect.height;
          avgWidth = rect.width / this.layoutNodes.length;

          childHeight = avgHeight;
          childWidth = avgWidth + (node.primaryOffset + node.secondaryOffset);
          childLeft = currentIndex * avgWidth + rect.left - node.primaryOffset;
          childTop = rect.top;
        }

        node.fill({
          height: childHeight,
          width: childWidth,
          left: childLeft,
          top: childTop,
        });
      });
    }
  }

  public shakeTree() {
    RLD(this, (layoutNode) => {
      if (
        layoutNode.layoutNodes.length === 0 &&
        layoutNode.panelNodes.length === 0
      ) {
        layoutNode.parent?.removeChild(layoutNode);
        return this;
      }
      if (
        layoutNode.panelNodes.length === 0 &&
        layoutNode.direction === LAYOUT_DIRECTION.TAB
      ) {
        layoutNode.parent?.removeChild(layoutNode);
        return this;
      }
      if (
        layoutNode.layoutNodes.length === 0 &&
        layoutNode.direction !== LAYOUT_DIRECTION.TAB
      ) {
        layoutNode.parent?.removeChild(layoutNode);
        return this;
      }

      if (layoutNode.layoutNodes.length === 1) {
        layoutNode.parent?.replaceChild(layoutNode.layoutNodes[0], layoutNode);
      }

      if (layoutNode.direction === layoutNode.parent?.direction) {
        const index = layoutNode.parent.layoutNodes.findIndex(
          (c) => c === layoutNode
        );
        if (index === -1) {
          throw new Error(
            "node has parent,but didn't find in parent's children"
          );
        }
        const primaryNode = layoutNode.parent.layoutNodes[index - 1];
        const secondaryNode = layoutNode.parent.layoutNodes[index + 1];
        layoutNode.parent.layoutNodes.splice(
          index,
          1,
          ...layoutNode.layoutNodes
        );
        if (primaryNode != null) {
          layoutNode.layoutNodes[0].primaryOffset =
            -primaryNode.secondaryOffset;
        }
        if (secondaryNode != null) {
          layoutNode.layoutNodes[
            layoutNode.layoutNodes.length - 1
          ].secondaryOffset = -secondaryNode.primaryOffset;
        }
        layoutNode.layoutNodes.forEach((c) => (c.parent = layoutNode.parent));
        layoutNode.parent = null;
        layoutNode.layoutNodes = [];
      }
    });
    return this;
  }

  private addPanelNode(data: AddPanelData) {
    const { panelNode, mask, target } = data;
    const direction = directionFromMask(mask);
    const oldLayout =
      target instanceof LayoutNode
        ? target
        : findPanelNode(this, (p) => p.id === target)?.parent ||
          findLayoutNode(this, (p) => p.id === target);
    if (oldLayout?.direction === LAYOUT_DIRECTION.ROOT) {
      if (oldLayout.layoutNodes.length !== 0) {
        this.addPanelNode({
          panelNode,
          mask,
          target: oldLayout.layoutNodes[0],
        });
      } else {
        oldLayout.appendLayoutNode(
          new LayoutNode({
            direction: LAYOUT_DIRECTION.TAB,
          })
        );
        this.addPanelNode({
          panelNode,
          mask,
          target: oldLayout.layoutNodes[0],
        });
      }
      return this;
    }

    if (oldLayout == null) {
      throw new Error("");
    }

    if (mask === MASK_PART.CENTER) {
      oldLayout.appendPanelNode(panelNode);
    } else {
      const tabLayout = new LayoutNode({ direction: LAYOUT_DIRECTION.TAB });
      tabLayout.appendPanelNode(panelNode);
      const layout = new LayoutNode({ direction: direction });

      if (oldLayout == null) {
        throw new Error("");
      }
      oldLayout.parent?.replaceChild(layout, oldLayout);
      oldLayout.primaryOffset = 0;
      oldLayout.secondaryOffset = 0;
      if (mask === MASK_PART.LEFT || mask === MASK_PART.TOP) {
        layout.appendLayoutNode(tabLayout, oldLayout);
      }
      if (mask === MASK_PART.RIGHT || mask === MASK_PART.BOTTOM) {
        layout.appendLayoutNode(oldLayout, tabLayout);
      }
    }
    panelNode.parent?.panelNodes.forEach((p) => (p.selected = false));
    panelNode.selected = true;
    return this;
  }

  private removePanelNode(data: RemovePanelData) {
    const { search } = data;
    const panelNode = findPanelNode(this, (p) => p.id === search);

    if (panelNode == null) {
      throw new Error("");
    }

    panelNode.remove();

    return panelNode;
  }

  private movePanelNode(data: MovePanelData) {
    const { search, mask, target } = data;
    const panelNode = findPanelNode(this, (p) => p.id === search);
    const oldLayout =
      target instanceof LayoutNode
        ? target
        : findPanelNode(this, (p) => p.id === target)?.parent;

    if (panelNode == null || oldLayout == null) {
      throw new Error("");
    }

    if (!(target instanceof LayoutNode)) {
      panelNode.remove();
    }

    this.addPanelNode({ panelNode, mask, target: oldLayout });
  }

  private selectTab(data: SelectTabData) {
    const panelNode = getPanelById(this, data.search);

    if (
      panelNode != null &&
      panelNode.parent != null &&
      panelNode.selected === false
    ) {
      panelNode.parent.panelNodes.forEach((p) => (p.selected = false));
      panelNode.selected = true;
    }
  }

  private moveSplitter(data: MoveSplitterData) {
    const primaryNode = getPanelById(this, data.primary)?.parent;
    const secondaryNode = getPanelById(this, data.secondary)?.parent;
    if (primaryNode != null && secondaryNode != null) {
      primaryNode.secondaryOffset = primaryNode.secondaryOffset + data.offset;
      secondaryNode.primaryOffset = secondaryNode.primaryOffset - data.offset;
    }
  }
}

export default LayoutNode;
