import { nanoid } from "nanoid";

import type LayoutNode from "../LayoutNode";
import type { IPanel, IPanelJSON } from "./type";
export type * from "./type";

class PanelNode {
  id: string = nanoid();
  parent: LayoutNode | null = null;
  page: string = "";
  selected: boolean = false;
  data?: any;

  constructor(panelJSON?: Partial<IPanelJSON>) {
    if (panelJSON?.id != null) {
      this.id = panelJSON.id;
    }
    if (panelJSON?.data != null) {
      this.data = panelJSON.data;
    }
    if (panelJSON?.page != null) {
      this.page = panelJSON.page;
    }
  }

  public remove() {
    if (this.parent != null) {
      this.parent.panelNodes = this.parent.panelNodes.filter((p) => p !== this);
      this.parent = null;
    }
    return this;
  }
}

export default PanelNode;

export const panelNodeToJSON = (panelNode: PanelNode): IPanelJSON => {
  return {
    id: panelNode.id,
    page: panelNode.page,
    data: panelNode.data,
  };
};

export const getPanel = (panelNode: PanelNode): IPanel => {
  return {
    id: panelNode.id,
    height: panelNode.parent?.height || 0,
    width: panelNode.parent?.width || 0,
    left: panelNode.parent?.left || 0,
    top: panelNode.parent?.top || 0,
    parentId: panelNode.parent?.id || "",
    page: panelNode.page,
    selected: panelNode.selected,
    data: panelNode.data,
  };
};
