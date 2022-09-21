import { proxy } from "valtio";

import { ILayoutNode, IPanelNode, ISplitterNode } from "../type";

const state = proxy({
  layouts: [] as ILayoutNode[],
  panels: [] as IPanelNode[],
  splitters: [] as ISplitterNode[],
});

export default state;
