import { EventEmitter } from "events";

import DragListenable, {
    DRAG_LISTENABLE_EVENT,
    IDragItem,
} from "./DragListenable";
import DropListenable, { DROP_LISTENABLE_EVENT } from "./DropListenable";

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
    private draggingItem: IDragItem | null = null;
    private previewCanvas: HTMLCanvasElement | null = null;
    public setPreviewCanvas(ele: HTMLCanvasElement | null) {
        if (ele == null) {
            this.previewCanvas?.remove();
            this.previewCanvas = null;
        } else {
            document.getElementById("root")?.appendChild(ele);
            this.previewCanvas = ele;
        }
    }
    draggable<T extends Element, I extends IDragItem>(
        ele: T,
        crossWindow: boolean = false,
        option?: {
            item?: I;
        }
    ) {
        const listenable = new DragListenable(this, ele, crossWindow, option);

        listenable.on(DRAG_LISTENABLE_EVENT.DRAG_START, (data) => {
            listenable.emit(DND_EVENT.DRAG_START, data);
        });

        listenable.on(DRAG_LISTENABLE_EVENT.DRAG_END, (data) => {
            listenable.emit(DND_EVENT.DRAG_END, data);
        });

        listenable.on(DRAG_LISTENABLE_EVENT.DRAG, (data) => {
            listenable.emit(DND_EVENT.DRAG, data);
        });

        return listenable;
    }

    droppable<T extends Element>(ele: T, crossWindow: boolean = false) {
        const listenable = new DropListenable(this, ele, crossWindow);
        listenable.on(DROP_LISTENABLE_EVENT.DROP, (data) => {
            listenable.emit(DND_EVENT.DROP, {
                item: this.draggingItem,
                ...data,
            });
        });

        listenable.on(DROP_LISTENABLE_EVENT.DRAG_OVER, (data) => {
            listenable.emit(DND_EVENT.DRAG_OVER, {
                item: this.draggingItem,
                ...data,
            });
        });

        listenable.on(DROP_LISTENABLE_EVENT.DRAG_LEAVE, (data) => {
            listenable.emit(DND_EVENT.DRAG_LEAVE, {
                item: this.draggingItem,
                ...data,
            });
        });

        return listenable;
    }

    setDragging(dragging: boolean) {
        this.dragging = dragging;
    }

    getDraggingItem() {
        return this.draggingItem;
    }

    setDraggingItem<I extends IDragItem>(item: I | null) {
        this.draggingItem = item;
    }

    isDragging() {
        return this.dragging;
    }
}

export default Dnd;
