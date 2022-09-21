import {
    ILayoutNode,
    IPanelNode,
    ISplitterNode,
} from "@idealjs/layout-manager";
import { proxy } from "valtio";

const state = proxy({
    layouts: [] as ILayoutNode[],
    panels: [] as IPanelNode[],
    splitters: [] as ISplitterNode[],
});

export default state;
