import EventEmitter from "events";
import directionFromMask from "lib/directionFromMask";
import PanelNode from "lib/PanelNode";
import { nanoid } from "nanoid";
import { ROOTID } from "src/constant";
import { LAYOUT_DIRECTION, MASK_PART } from "src/enum";
import {
    ADD_PANEL_DATA,
    ILayoutJSON,
    ILayoutNode,
    IPanelNode,
    IRule,
    ISplitterNode,
    MOVE_PANEL_DATA,
    MOVE_SPLITTER_DATA,
    REMOVE_PANEL_DATA,
    SELECT_TAB_DATA,
} from "src/type";

const is_ADD_PANEL_DATA = (data: ActionPayload): data is ADD_PANEL_DATA => {
    return (
        (data as ADD_PANEL_DATA).mask != null &&
        (data as ADD_PANEL_DATA).panelNode != null &&
        (data as ADD_PANEL_DATA).target != null
    );
};

const is_MOVE_PANEL_DATA = (data: ActionPayload): data is MOVE_PANEL_DATA => {
    return (
        (data as MOVE_PANEL_DATA).mask != null &&
        (data as MOVE_PANEL_DATA).search != null &&
        (data as MOVE_PANEL_DATA).target != null
    );
};

const is_MOVE_SPLITTER_DATA = (
    data: ActionPayload
): data is MOVE_SPLITTER_DATA => {
    return (
        (data as MOVE_SPLITTER_DATA).offset != null &&
        (data as MOVE_SPLITTER_DATA).primary != null &&
        (data as MOVE_SPLITTER_DATA).secondary != null
    );
};

const is_REMOVE_PANEL_DATA = (
    data: ActionPayload
): data is REMOVE_PANEL_DATA => {
    return (data as REMOVE_PANEL_DATA).search != null;
};

const is_SELECT_TAB_DATA = (data: ActionPayload): data is SELECT_TAB_DATA => {
    return (data as SELECT_TAB_DATA).search != null;
};

export enum LayoutNodeActionType {
    ADD_PANEL = "ADD_PANEL",
    MOVE_PANEL = "MOVE_PANEL",
    MOVE_SPLITTER = "MOVE_SPLITTER",
    REMOVE_PANEL = "REMOVE_PANEL",
    SELECT_TAB = "SELECT_TAB",
}

export type ActionPayload =
    | ADD_PANEL_DATA
    | MOVE_PANEL_DATA
    | MOVE_SPLITTER_DATA
    | REMOVE_PANEL_DATA
    | SELECT_TAB_DATA;

export const LayoutNodeUpdate = Symbol("LayoutNodeUpdate");

interface LayoutNode {
    doAction(
        actionType: LayoutNodeActionType.ADD_PANEL,
        actionPayload: ADD_PANEL_DATA
    ): void;
    doAction(
        actionType: LayoutNodeActionType.MOVE_PANEL,
        actionPayload: MOVE_PANEL_DATA
    ): void;
    doAction(
        actionType: LayoutNodeActionType.MOVE_SPLITTER,
        actionPayload: MOVE_SPLITTER_DATA
    ): void;
    doAction(
        actionType: LayoutNodeActionType.REMOVE_PANEL,
        actionPayload: REMOVE_PANEL_DATA
    ): void;
    doAction(
        actionType: LayoutNodeActionType.SELECT_TAB,
        actionPayload: SELECT_TAB_DATA
    ): void;
}

class LayoutNode extends EventEmitter implements LayoutNode {
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

    constructor(options: {
        layoutJSON: Partial<Exclude<ILayoutJSON, "direction">> & {
            direction: LAYOUT_DIRECTION | keyof typeof LAYOUT_DIRECTION;
        };
    }) {
        super();
        this.direction = options.layoutJSON.direction;
        if (options.layoutJSON.id != null) {
            this.id = options.layoutJSON.id;
        }
        if (options.layoutJSON.primaryOffset != null) {
            this.primaryOffset = options.layoutJSON.primaryOffset;
        }
        if (options.layoutJSON.secondaryOffset != null) {
            this.secondaryOffset = options.layoutJSON.secondaryOffset;
        }
        if (
            options.layoutJSON.layouts != null &&
            options.layoutJSON.layouts.length !== 0
        ) {
            this.appendLayoutNode(
                ...options.layoutJSON.layouts.map(
                    (l) => new LayoutNode({ layoutJSON: l })
                )
            );
        }
        if (
            options.layoutJSON.panels != null &&
            options.layoutJSON.panels.length !== 0
        ) {
            this.appendPanelNode(
                ...options.layoutJSON.panels.map(
                    (p) => new PanelNode({ panelJSON: p })
                )
            );
        }
    }

    public doAction(
        actionType: LayoutNodeActionType,
        actionPayload: ActionPayload
    ) {
        switch (actionType) {
            case LayoutNodeActionType.ADD_PANEL:
                if (is_ADD_PANEL_DATA(actionPayload)) {
                    this.addPanelNode(actionPayload);
                }
                break;
            case LayoutNodeActionType.MOVE_PANEL:
                if (is_MOVE_PANEL_DATA(actionPayload)) {
                    this.movePanelNode(actionPayload);
                }
                break;
            case LayoutNodeActionType.MOVE_SPLITTER:
                if (is_MOVE_SPLITTER_DATA(actionPayload)) {
                    this.moveSplitter(actionPayload);
                }
                break;
            case LayoutNodeActionType.REMOVE_PANEL:
                if (is_REMOVE_PANEL_DATA(actionPayload)) {
                    this.removePanelNode(actionPayload);
                }
                break;
            case LayoutNodeActionType.SELECT_TAB:
                if (is_SELECT_TAB_DATA(actionPayload)) {
                    this.selectTab(actionPayload);
                }
                break;
            default:
                break;
        }
        this.emit(LayoutNodeUpdate);
    }

    public appendLayoutNode(...children: LayoutNode[]) {
        this.layoutNodes = this.layoutNodes.concat(children);
        children.forEach((c) => (c.parent = this));
        return this;
    }

    public appendPanelNode(...children: PanelNode[]) {
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

    public insertBefore(newChild: LayoutNode, refChild: LayoutNode) {
        const index = this.layoutNodes.findIndex((c) => c === refChild);
        if (index !== -1) {
            const primaryNode = this.layoutNodes[index - 1];
            if (primaryNode) {
                newChild.primaryOffset = primaryNode.secondaryOffset;
            }
            if (refChild) {
                newChild.secondaryOffset = refChild.primaryOffset;
            }
            this.layoutNodes.splice(index, 0, newChild);
            newChild.parent = refChild.parent;
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

    public getLayoutById(id: string) {
        return this.findLayoutNode((n) => n.id === id);
    }

    public getPanelById(id: string) {
        return this.findPanelNode((n) => n.id === id);
    }

    private isValid(): boolean {
        const includes =
            this.direction === LAYOUT_DIRECTION.ROOT
                ? true
                : this.parent?.layoutNodes.includes(this);
        const childrenValidation = this.layoutNodes.reduce((p, c) => {
            if (c.direction === LAYOUT_DIRECTION.TAB) {
                return c.isValid() && c.panelNodes.length !== 0 && p;
            }
            return c.isValid() && p;
        }, true);
        return childrenValidation && (includes != null ? includes : false);
    }

    public fill(
        rect: {
            height: number;
            width: number;
            left: number;
            top: number;
        },
        splitterThickness: number
    ) {
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
                    avgHeight =
                        (rect.height -
                            (this.layoutNodes.length - 1) * splitterThickness) /
                        this.layoutNodes.length;
                    avgWidth = rect.width;

                    childHeight =
                        avgHeight + (node.primaryOffset + node.secondaryOffset);

                    childWidth = avgWidth;
                    childLeft = rect.left;
                    childTop =
                        currentIndex * avgHeight +
                        rect.top +
                        currentIndex * splitterThickness -
                        node.primaryOffset;
                }

                if (this.direction === LAYOUT_DIRECTION.ROW) {
                    avgHeight = rect.height;
                    avgWidth =
                        (rect.width -
                            (this.layoutNodes.length - 1) * splitterThickness) /
                        this.layoutNodes.length;

                    childHeight = avgHeight;
                    childWidth =
                        avgWidth + (node.primaryOffset + node.secondaryOffset);
                    childLeft =
                        currentIndex * avgWidth +
                        rect.left +
                        currentIndex * splitterThickness -
                        node.primaryOffset;
                    childTop = rect.top;
                }

                node.fill(
                    {
                        height: childHeight,
                        width: childWidth,
                        left: childLeft,
                        top: childTop,
                    },
                    splitterThickness
                );
            });
        }
    }

    public parseLayout(): ILayoutNode[] {
        if (this.direction === LAYOUT_DIRECTION.TAB) {
            if (
                !this.panelNodes.map((c) => c.selected).includes(true) &&
                this.panelNodes.length > 0
            ) {
                this.panelNodes[0].selected = true;
            }
        }
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
                    ? this.layoutNodes.map((node) => node.id)
                    : this.panelNodes.map((node) => node.id),
            direction: this.direction,
        };
        return this.layoutNodes
            .flatMap((node) => node.parseLayout())
            .concat(layout);
    }

    public parseSplitter(splitterThickness: number): ISplitterNode[] {
        const index = this.parent?.layoutNodes.findIndex(
            (node) => node === this
        );
        if (
            this.parent == null ||
            index == null ||
            index === -1 ||
            index === this.parent.layoutNodes.length - 1
        ) {
            return this.layoutNodes.flatMap((node) =>
                node.parseSplitter(splitterThickness)
            );
        }

        let splitterHeight = 0;
        let splitterWidth = 0;
        let splitterLeft = 0;
        let splitterTop = 0;

        if (this.parent.direction === LAYOUT_DIRECTION.COL) {
            splitterHeight = splitterThickness;
            splitterWidth = this.parent.width;
            splitterLeft = this.parent.left;
            splitterTop = this.top + this.height;
        }

        if (this.parent.direction === LAYOUT_DIRECTION.ROW) {
            splitterHeight = this.parent.height;
            splitterWidth = splitterThickness;
            splitterLeft = this.left + this.width;
            splitterTop = this.parent.top;
        }

        const splitter: ISplitterNode = {
            id: `${this.parent.id}_${this.id}_${
                this.parent.layoutNodes[index + 1].id
            }`,
            height: splitterHeight,
            width: splitterWidth,
            left: splitterLeft,
            top: splitterTop,
            primaryId: this.id,
            secondaryId: this.parent.layoutNodes[index + 1].id,
            parentId: this.parent.id,
        };

        return this.layoutNodes
            .flatMap((node) => node.parseSplitter(splitterThickness))
            .concat(splitter);
    }

    public parsePanel(titlebarHeight: number = 25): IPanelNode[] {
        return this.layoutNodes
            .flatMap((node) => node.parsePanel(titlebarHeight))
            .concat(
                this.panelNodes.map((pChild) =>
                    pChild.parsePanel(titlebarHeight)
                )
            );
    }

    public toJSON(): ILayoutJSON {
        return {
            id: this.id,
            direction: this.direction,
            primaryOffset: this.primaryOffset,
            secondaryOffset: this.secondaryOffset,
            layouts: this.layoutNodes.map((n) => n.toJSON()),
            panels: this.panelNodes.map((n) => n.toJSON()),
        };
    }

    private find(
        predicate: (layout: LayoutNode) => boolean
    ): LayoutNode | null {
        if (predicate(this)) {
            return this;
        }
        return this.layoutNodes.reduce(
            (p: LayoutNode | null, c: LayoutNode) => {
                return p != null ? p : c.find(predicate);
            },
            null
        );
    }

    public findPanelNode(
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

        return this.layoutNodes.reduce((p: PanelNode | null, c: LayoutNode) => {
            return p != null ? p : c.findPanelNode(predicate);
        }, null);
    }

    public findLayoutNode(
        predicate: (layoutNode: LayoutNode, level: number) => boolean,
        level = 0
    ): LayoutNode | null {
        if (predicate(this, level)) {
            return this;
        }

        return this.layoutNodes.reduce(
            (p: LayoutNode | null, c: LayoutNode) => {
                return p != null ? p : c.findLayoutNode(predicate, level + 1);
            },
            null
        );
    }

    private DLR(t: (layout: LayoutNode) => void) {
        t(this);
        for (let index = 0; index < this.layoutNodes.length; index++) {
            this.layoutNodes[index].LRD(t);
        }
    }

    private LRD(t: (layout: LayoutNode) => void) {
        for (let index = 0; index < this.layoutNodes.length; index++) {
            this.layoutNodes[index].LRD(t);
        }
        t(this);
    }

    public shakeTree() {
        console.debug("[Debug] start shakeTree");

        this.LRD((l) => {
            if (
                l.panelNodes.length === 0 &&
                l.direction === LAYOUT_DIRECTION.TAB
            ) {
                l.parent?.removeChild(l);
            }
            if (
                l.layoutNodes.length === 0 &&
                l.direction !== LAYOUT_DIRECTION.TAB
            ) {
                l.parent?.removeChild(l);
            }
            if (
                l.layoutNodes.length === 1 &&
                l.layoutNodes[0].direction === l.direction
            ) {
                l.parent?.replaceChild(l.layoutNodes[0], l);
            }
            if (l.direction === l.parent?.direction) {
                const index = l.parent.layoutNodes.findIndex((c) => c === l);
                if (index === -1) {
                    throw new Error(
                        "node has parent,but didn't find in parent's children"
                    );
                }
                const primaryNode = l.parent.layoutNodes[index - 1];
                const secondaryNode = l.parent.layoutNodes[index + 1];
                l.parent.layoutNodes.splice(index, 1, ...l.layoutNodes);
                if (primaryNode != null) {
                    l.layoutNodes[0].primaryOffset =
                        -primaryNode.secondaryOffset;
                }
                if (secondaryNode != null) {
                    l.layoutNodes[l.layoutNodes.length - 1].secondaryOffset =
                        -secondaryNode.primaryOffset;
                }
                l.layoutNodes.forEach((c) => (c.parent = l.parent));
                l.parent = null;
                l.layoutNodes = [];
            }
        });
        console.debug("[Debug] end shakeTree", this);
        console.debug("[Debug] isTreeValid", this.isValid());
        return this;
    }

    private addPanelNode(data: ADD_PANEL_DATA) {
        const { panelNode, mask, target } = data;
        const direction = directionFromMask(mask);
        const oldLayout =
            target instanceof LayoutNode
                ? target
                : this.findPanelNode((p) => p.id === target)?.parent ||
                  this.findLayoutNode((p) => p.id === target);
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
                        layoutJSON: {
                            direction: LAYOUT_DIRECTION.TAB,
                        },
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
            const tabLayout = new LayoutNode({
                layoutJSON: { direction: LAYOUT_DIRECTION.TAB },
            });
            tabLayout.appendPanelNode(panelNode);
            const layout = new LayoutNode({
                layoutJSON: { direction: direction },
            });

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

    private removePanelNode(data: REMOVE_PANEL_DATA) {
        const { search } = data;
        const panelNode = this.findPanelNode((p) => p.id === search);

        if (panelNode == null) {
            throw new Error("");
        }

        panelNode.remove();

        return panelNode;
    }

    private movePanelNode(data: MOVE_PANEL_DATA) {
        const { search, mask, target } = data;
        const panelNode = this.findPanelNode((p) => p.id === search);
        const oldLayout =
            target instanceof LayoutNode
                ? target
                : this.findPanelNode((p) => p.id === target)?.parent;

        if (panelNode == null || oldLayout == null) {
            throw new Error("");
        }

        if (!(target instanceof LayoutNode)) {
            panelNode.remove();
        }

        this.addPanelNode({ panelNode, mask, target: oldLayout });
    }

    private selectTab(data: SELECT_TAB_DATA) {
        const panelNode = this.getPanelById(data.search);

        if (
            panelNode != null &&
            panelNode.parent != null &&
            panelNode.selected === false
        ) {
            panelNode.parent.panelNodes.forEach((p) => (p.selected = false));
            panelNode.selected = true;
        }
    }

    private moveSplitter(data: MOVE_SPLITTER_DATA) {
        const primaryNode = this.getLayoutById(data.primary);
        const secondaryNode = this.getLayoutById(data.secondary);

        if (primaryNode != null && secondaryNode != null) {
            primaryNode.secondaryOffset =
                primaryNode.secondaryOffset + data.offset;
            secondaryNode.primaryOffset =
                secondaryNode.primaryOffset - data.offset;
        }
    }

    public findNodeByRules(rules: IRule[]): {
        layoutNode: LayoutNode;
        rule: IRule;
    } | null {
        return rules.reduce(
            (
                p: {
                    layoutNode: LayoutNode;
                    rule: IRule;
                } | null,
                c: IRule,
                index
            ) => {
                const direction = directionFromMask(c.part);
                if (p != null) {
                    return p;
                }
                const layoutNode = this.findLayoutNode((l, level) => {
                    if (
                        direction === LAYOUT_DIRECTION.TAB &&
                        direction === l.direction &&
                        l.panelNodes.length < c.max
                    ) {
                        if (c.limitLevel != null) {
                            if (c.limitLevel >= level - 1) {
                                return true;
                            }
                        } else {
                            return true;
                        }
                    }

                    if (direction !== LAYOUT_DIRECTION.TAB) {
                        if (
                            l.direction === direction &&
                            l.layoutNodes.length < c.max &&
                            level - 1 <= index
                        ) {
                            if (c.limitLevel != null) {
                                if (c.limitLevel >= level - 1) {
                                    return true;
                                }
                            } else {
                                return true;
                            }
                        }
                        if (l.direction !== direction && level - 1 === index) {
                            if (c.limitLevel != null) {
                                if (c.limitLevel >= level - 1) {
                                    return true;
                                }
                            } else {
                                return true;
                            }
                        }
                    }

                    return false;
                });
                if (layoutNode == null) {
                    return null;
                }
                return {
                    layoutNode,
                    rule: c,
                };
            },
            null
        );
    }
}

export default LayoutNode;
