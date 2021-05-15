import { nanoid } from "nanoid";

import { IPanelNode } from "../reducer/type";
import LayoutNode from "./LayoutNode";
import { IPanelJSON } from "./type";

class PanelNode {
    id: string = nanoid();
    height: number = 0;
    width: number = 0;
    left: number = 0;
    top: number = 0;
    parent: LayoutNode | null = null;
    page: string = "";
    selected: boolean = false;
    data?: any;

    constructor(options: { panelJSON: Partial<IPanelJSON> }) {
        if (options.panelJSON.id != null) {
            this.id = options.panelJSON.id;
        }
        if (options.panelJSON.data != null) {
            this.data = options.panelJSON.data;
        }
        if (options.panelJSON.page != null) {
            this.page = options.panelJSON.page;
        }
    }

    public parsePanel(): IPanelNode {
        return {
            id: this.id,
            height: (this.parent?.height || 0) - 25,
            width: this.parent?.width || 0,
            left: this.parent?.left || 0,
            top: (this.parent?.top || 0) + 25,
            parentId: this.parent?.id || "",
            page: this.page,
            selected: this.selected,
            data: this.data,
        };
    }
    public remove() {
        if (this.parent != null) {
            this.parent.panelNodes = this.parent.panelNodes.filter(
                (p) => p !== this
            );
            this.parent = null;
        }
        return this;
    }
    public toJSON(): IPanelJSON {
        return {
            id: this.id,
            page: this.page,
            data: this.data,
        };
    }
}

export default PanelNode;
