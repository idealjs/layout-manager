import { uniqueId } from "lodash";

import { IPanelNode } from "../reducer/type";
import LayoutNode from "./LayoutNode";

class PanelNode {
    id: string = uniqueId();
    height: number = 0;
    width: number = 0;
    left: number = 0;
    top: number = 0;
    parent: LayoutNode | null = null;
    page: string = "";
    selected: boolean = false;
    data?: any;

    parsePanel(): IPanelNode {
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
    remove() {
        if (this.parent != null) {
            this.parent.panelNodes = this.parent.panelNodes.filter(
                (p) => p !== this
            );
            this.parent = null;
        }
        return this;
    }
}

export default PanelNode;
