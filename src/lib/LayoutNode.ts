import { uniqueId } from "lodash";

import { ROOTID } from "../constant";
import {
    ILayoutNode,
    IPanelNode,
    ISplitterNode,
    LAYOUT_DIRECTION,
} from "../reducer/type";
import PanelNode from "./PanelNode";
const splitterBlock = 10;
class LayoutNode {
    id: string = uniqueId();
    height: number = 0;
    width: number = 0;
    left: number = 0;
    top: number = 0;
    primaryOffset: number = 0;
    secondaryOffset: number = 0;
    children: LayoutNode[] = [];
    panelNodes: PanelNode[] = [];

    direction: LAYOUT_DIRECTION | null = null;
    parent: LayoutNode | null = null;

    append(...children: LayoutNode[]) {
        this.children = this.children.concat(children);
        children.forEach((c) => (c.parent = this));
        return this;
    }

    appendPanelNode(...children: PanelNode[]) {
        this.panelNodes = this.panelNodes.concat(children);
        children.forEach((c) => (c.parent = this));
        return this;
    }

    insertBefore(newChild: LayoutNode, refChild: LayoutNode) {
        const index = this.children.findIndex((c) => c === refChild);
        if (index !== -1) {
            const primaryNode = this.children[index - 1];
            if (primaryNode) {
                newChild.primaryOffset = primaryNode.secondaryOffset;
            }
            if (refChild) {
                newChild.secondaryOffset = refChild.primaryOffset;
            }
            this.children.splice(index, 0, newChild);
            newChild.parent = refChild.parent;
        }
        return this;
    }

    removeChild(oldChild: LayoutNode) {
        const index = this.children.findIndex((c) => c === oldChild);
        if (index !== -1) {
            const primaryNode = this.children[index - 1];
            const secondaryNode = this.children[index + 1];
            if (primaryNode) {
                primaryNode.secondaryOffset =
                    primaryNode.secondaryOffset + oldChild.primaryOffset;
            }
            if (secondaryNode) {
                secondaryNode.primaryOffset =
                    secondaryNode.primaryOffset + oldChild.secondaryOffset;
            }
            this.children.splice(index, 1);
            oldChild.parent = null;
        }
        return this;
    }

    replaceChild(newChild: LayoutNode, oldChild: LayoutNode) {
        const index = this.children.findIndex((c) => c === oldChild);
        if (index !== -1) {
            const primaryNode = this.children[index - 1];
            const secondaryNode = this.children[index + 1];
            if (primaryNode) {
                newChild.primaryOffset = oldChild.primaryOffset;
            }
            if (secondaryNode) {
                newChild.secondaryOffset = oldChild.secondaryOffset;
            }
            this.children[index] = newChild;
            newChild.parent = oldChild.parent;
            oldChild.parent = null;
        }
        return this;
    }

    getLayoutById(id: string) {
        return this.find((l) => l.id === id);
    }

    isValid(): boolean {
        const includes = this.parent?.children.includes(this);
        const childrenValidation = this.children.reduce((p, c) => {
            return c.isValid();
        }, true);
        return childrenValidation || (includes ? includes : false);
    }

    fill(rect: { height: number; width: number; left: number; top: number }) {
        this.height = rect.height;
        this.width = rect.width;
        this.left = rect.left;
        this.top = rect.top;

        if (
            this.direction !== LAYOUT_DIRECTION.TAB &&
            this.children.length !== 0
        ) {
            let childHeight = 0;
            let childWidth = 0;
            let childLeft = 0;
            let childTop = 0;

            let avgHeight = 0;
            let avgWidth = 0;

            this.children.forEach((child, currentIndex) => {
                if (this.direction === LAYOUT_DIRECTION.COL) {
                    avgHeight =
                        (rect.height -
                            (this.children.length - 1) * splitterBlock) /
                        this.children.length;
                    avgWidth = rect.width;

                    childHeight =
                        avgHeight +
                        (child.primaryOffset + child.secondaryOffset);

                    childWidth = avgWidth;
                    childLeft = rect.left;
                    childTop =
                        currentIndex * avgHeight +
                        rect.top +
                        currentIndex * splitterBlock -
                        child.primaryOffset;
                }

                if (this.direction === LAYOUT_DIRECTION.ROW) {
                    avgHeight = rect.height;
                    avgWidth =
                        (rect.width -
                            (this.children.length - 1) * splitterBlock) /
                        this.children.length;

                    childHeight = avgHeight;
                    childWidth =
                        avgWidth +
                        (child.primaryOffset + child.secondaryOffset);
                    childLeft =
                        currentIndex * avgWidth +
                        rect.left +
                        currentIndex * splitterBlock -
                        child.primaryOffset;
                    childTop = rect.top;
                }

                child.fill({
                    height: childHeight,
                    width: childWidth,
                    left: childLeft,
                    top: childTop,
                });
            });
        }
    }

    parseLayout(): ILayoutNode[] {
        const layout: ILayoutNode = {
            id: this.id,
            height: this.height,
            width: this.width,
            left: this.left,
            top: this.top,
            primaryOffset: this.primaryOffset,
            secondaryOffset: this.secondaryOffset,
            parentId: this.parent?.id ? this.parent.id : ROOTID,
            children:
                this.direction !== LAYOUT_DIRECTION.TAB
                    ? this.children.map((child) => child.id)
                    : this.panelNodes.map((child) => child.id),
            direction: this.direction,
        };
        return this.children
            .flatMap((child) => child.parseLayout())
            .concat(layout);
    }

    parseSplitter(): ISplitterNode[] {
        const index = this.parent?.children.findIndex(
            (child) => child === this
        );
        if (
            this.parent == null ||
            index == null ||
            index === -1 ||
            index === this.parent.children.length - 1
        ) {
            return this.children.flatMap((child) => child.parseSplitter());
        }

        let splitterHeight = 0;
        let splitterWidth = 0;
        let splitterLeft = 0;
        let splitterTop = 0;

        if (this.parent.direction === LAYOUT_DIRECTION.COL) {
            splitterHeight = splitterBlock;
            splitterWidth = this.parent.width;
            splitterLeft = this.parent.left;
            splitterTop = this.top + this.height;
        }

        if (this.parent.direction === LAYOUT_DIRECTION.ROW) {
            splitterHeight = this.parent.height;
            splitterWidth = splitterBlock;
            splitterLeft = this.left + this.width;
            splitterTop = this.parent.top;
        }

        const splitter: ISplitterNode = {
            id: `${this.parent.id}_${this.id}_${
                this.parent.children[index + 1].id
            }`,
            height: splitterHeight,
            width: splitterWidth,
            left: splitterLeft,
            top: splitterTop,
            primaryId: this.id,
            secondaryId: this.parent.children[index + 1].id,
            parentId: this.parent.id,
        };

        return this.children
            .flatMap((child) => child.parseSplitter())
            .concat(splitter);
    }

    parsePanel(): IPanelNode[] {
        return this.children
            .flatMap((child) => child.parsePanel())
            .concat(this.panelNodes.map((pChild) => pChild.parsePanel()));
    }

    find(predicate: (layout: LayoutNode) => boolean): LayoutNode | null {
        if (predicate(this)) {
            return this;
        }
        return this.children.reduce((p: LayoutNode | null, c: LayoutNode) => {
            return p != null ? p : c.find(predicate);
        }, null);
    }

    findPanelNode(
        predicate: (panelNode: PanelNode) => boolean
    ): PanelNode | null {
        let result = this.panelNodes.reduce(
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

        return this.children.reduce((p: PanelNode | null, c: LayoutNode) => {
            return p != null ? p : c.findPanelNode(predicate);
        }, null);
    }

    DLR(t: (layout: LayoutNode) => void) {
        t(this);
        this.children.forEach((child) => child.DLR(t));
    }

    LRD(t: (layout: LayoutNode) => void) {
        this.children.forEach((child) => child.LRD(t));
        t(this);
    }

    shakeTree() {
        console.debug("[Debug] start shakeTree");
        this.LRD((l) => {
            console.log("test test shaking tree", l);
            if (
                l.panelNodes.length === 0 &&
                l.direction === LAYOUT_DIRECTION.TAB
            ) {
                l.parent?.removeChild(l);
            }
            if (
                l.children.length === 0 &&
                l.direction !== LAYOUT_DIRECTION.TAB
            ) {
                l.parent?.removeChild(l);
            }
            if (
                l.children.length === 1 &&
                l.children[0].direction === l.direction
            ) {
                l.parent?.replaceChild(l.children[0], l);
            }
            if (l.direction === l.parent?.direction) {
                const index = l.parent.children.findIndex((c) => c === l);
                if (index === -1) {
                    throw new Error(
                        "node has parent,but didn't find in parent's children"
                    );
                }
                const primaryNode = l.parent.children[index - 1];
                const secondaryNode = l.parent.children[index + 1];
                l.parent.children.splice(index, 1, ...l.children);
                if (primaryNode != null) {
                    l.children[0].primaryOffset = primaryNode.secondaryOffset;
                }
                if (secondaryNode != null) {
                    l.children[l.children.length - 1].secondaryOffset =
                        secondaryNode.primaryOffset;
                }
            }
        });
        console.debug("[Debug] end shakeTree", this);
        return this;
    }
}

export default LayoutNode;
