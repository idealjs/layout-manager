import { EventEmitter } from "events";

import DragListenable from "./DragListenable";
import DropListenable from "./DropListenable";
import { IDragItem } from "./type";

export enum DND_EVENT {
    DRAG = "DND_EVENT/DRAG",
    DRAG_END = "DND_EVENT/DRAG_END",
    DRAG_ENTER = "DND_EVENT/DRAG_ENTER",
    DRAG_LEAVE = "DND_EVENT/DRAG_LEAVE",
    DRAG_OVER = "DND_EVENT/DRAG_OVER",
    DRAG_START = "DND_EVENT/DRAG_START",
    DROP = "DND_EVENT/DROP",
}

class Dnd extends EventEmitter {
    constructor() {
        super();
        this.setDragging = this.setDragging.bind(this);
    }

    private dragging = false;
    private previewCanvas: HTMLCanvasElement | null = null;
    private activeDrags: DragListenable[] = [];
    private activeDrops: DropListenable[] = [];

    public setPreviewCanvas(ele: HTMLCanvasElement | null) {
        if (ele == null) {
            this.previewCanvas?.remove();
            this.previewCanvas = null;
        } else {
            document.getElementById("root")?.appendChild(ele);
            this.previewCanvas = ele;
        }
    }

    public draggable<T extends Element, I extends IDragItem>(
        ele: T,
        options?: {
            crossWindow?: boolean;
            item?: I;
        }
    ) {
        const listenable = new DragListenable(
            this,
            ele,
            options?.crossWindow,
            options?.item
        );

        return listenable;
    }

    public droppable<T extends Element>(
        ele: T,
        options?: {
            crossWindow?: boolean;
            allowBubble?: boolean;
        }
    ) {
        const listenable = new DropListenable(this, ele, options?.crossWindow);
        return listenable;
    }

    public setDragging(dragging: boolean) {
        this.dragging = dragging;
    }

    public getDraggingItem() {
        return this.activeDrags[0]?.getDraggingItem();
    }

    public activeDrag(drag: DragListenable) {
        this.activeDrags.push(drag);
    }

    public cleanDrags() {
        this.activeDrags = [];
    }

    public activeDrop(drop: DropListenable) {
        this.activeDrops.push(drop);
    }

    public deactiveDrop(drop: DropListenable) {
        this.activeDrops = this.activeDrops.filter((d) => d !== drop);
    }

    public cleanDrops() {
        this.activeDrops = [];
    }

    public canDrop(drop: DropListenable) {
        return this.activeDrops.includes(drop);
    }

    public isActiveDrag(drag: DragListenable) {
        return this.activeDrags[0] === drag;
    }

    public isDragging() {
        return this.dragging;
    }
}

export default Dnd;
