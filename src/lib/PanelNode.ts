import { uniqueId } from "lodash";

import { IPanelNode } from "../reducer/type";
import LayoutNode from "./LayoutNode";

class PanelNode {
    id: string = uniqueId();
    parent: LayoutNode | null = null;
    page: string = "";
    selected: boolean = false;
    data?: any;

    parsePanel(): IPanelNode {
        return {
            id: this.id,
            parentId: this.parent?.id || "",
            page: this.page,
            selected: this.selected,
            data: this.data,
        };
    }
}

export default PanelNode;
