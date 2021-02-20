import EventEmitter from "events";

import Dnd from "./Dnd";
import isHTMLElement from "./isHTMLElement";

export enum DROP_LISTENABLE_EVENT {
    DRAG_ENTER = "DROP_LISTENER/DRAG_ENTER",
    DRAG_LEAVE = "DROP_LISTENER/DRAG_LEAVE",
    DRAG_OVER = "DROP_LISTENER/DRAG_OVER",
    DROP = "DROP_LISTENER/DROP",
}

class DropListenable<E extends Element> extends EventEmitter {
    private dnd: Dnd;
    private clientPosition: {
        x: number;
        y: number;
    } | null = null;
    constructor(dnd: Dnd, el: E, crossWindow: boolean) {
        super();
        this.dnd = dnd;
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onDragover = this.onDragover.bind(this);
        this.onDragleave = this.onDragleave.bind(this);
        this.onDrop = this.onDrop.bind(this);

        el.addEventListener("mouseup", this.onMouseUp as EventListener);
        el.addEventListener("mousemove", this.onMouseMove as EventListener);
        el.addEventListener("mouseleave", this.onMouseLeave as EventListener);

        if (crossWindow) {
            if (isHTMLElement(el)) {
                el.addEventListener("dragover", this.onDragover);
                el.addEventListener("dragleave", this.onDragleave);
                el.addEventListener("drop", this.onDrop);
            } else {
                throw new Error(`Can't add drop listener to ${el}`);
            }
        }
    }

    private onMouseUp(event: MouseEvent) {
        if (this.dnd.isDragging()) {
            this.clientPosition = {
                x: event.clientX,
                y: event.clientY,
            };
            this.emit(DROP_LISTENABLE_EVENT.DROP, {
                clientPosition: this.clientPosition,
            });
            this.clientPosition = null;
        }
    }

    private onMouseMove(event: MouseEvent) {
        if (this.dnd.isDragging()) {
            this.clientPosition = {
                x: event.clientX,
                y: event.clientY,
            };

            this.emit(DROP_LISTENABLE_EVENT.DRAG_OVER, {
                clientPosition: this.clientPosition,
                item: this.dnd.getDraggingItem(),
            });
        }
    }

    private onMouseLeave(event: MouseEvent) {
        if (this.dnd.isDragging()) {
            this.clientPosition = {
                x: event.clientX,
                y: event.clientY,
            };

            this.emit(DROP_LISTENABLE_EVENT.DRAG_LEAVE, {
                crossWindow: true,
                clientPosition: this.clientPosition,
                item: this.dnd.getDraggingItem(),
            });
        }
    }

    private onDragover(event: DragEvent) {
        event.preventDefault();
        this.clientPosition = {
            x: event.clientX,
            y: event.clientY,
        };

        this.emit(DROP_LISTENABLE_EVENT.DRAG_OVER, {
            clientPosition: this.clientPosition,
            item: this.dnd.getDraggingItem(),
        });
    }

    private onDragleave(event: DragEvent) {
        this.clientPosition = {
            x: event.clientX,
            y: event.clientY,
        };

        this.emit(DROP_LISTENABLE_EVENT.DRAG_LEAVE, {
            clientPosition: this.clientPosition,
            item: this.dnd.getDraggingItem(),
        });
    }

    private onDrop(event: DragEvent) {
        this.clientPosition = {
            x: event.clientX,
            y: event.clientY,
        };

        this.emit(DROP_LISTENABLE_EVENT.DROP, {
            clientPosition: this.clientPosition,
            item: this.dnd.getDraggingItem(),
        });

        this.clientPosition = null;
    }
}

export default DropListenable;
