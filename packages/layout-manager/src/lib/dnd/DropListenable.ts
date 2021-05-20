import EventEmitter from "events";

import Dnd, { DND_EVENT } from "./Dnd";
import isHTMLElement from "./isHTMLElement";
import { IDropData, IPoint } from "./type";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
declare interface DropListenable<E extends Element> {
    addListener<I extends {}>(
        event: string | symbol,
        listener: (data: IDropData<I>) => void
    ): this;
}

class DropListenable<E extends Element> extends EventEmitter {
    private dnd: Dnd;
    private clientPosition: IPoint | null = null;
    private el: E;
    constructor(dnd: Dnd, el: E, crossWindow: boolean) {
        super();
        this.dnd = dnd;
        this.el = el;
        this.onMouseUp = this.onMouseUp.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onDragover = this.onDragover.bind(this);
        this.onDragleave = this.onDragleave.bind(this);
        this.onDrop = this.onDrop.bind(this);

        if (crossWindow) {
            if (isHTMLElement(el)) {
                el.addEventListener("dragover", this.onDragover);
                el.addEventListener("dragleave", this.onDragleave);
                el.addEventListener("drop", this.onDrop);
            } else {
                throw new Error(`Can't add drop listener to ${el}`);
            }
        } else {
            el.addEventListener("mouseup", this.onMouseUp as EventListener);
            el.addEventListener("mousemove", this.onMouseMove as EventListener);
            el.addEventListener(
                "mouseleave",
                this.onMouseLeave as EventListener
            );
        }
    }

    private onMouseUp(event: MouseEvent) {
        if (this.dnd.isDragging()) {
            this.clientPosition = {
                x: event.clientX,
                y: event.clientY,
            };
            this.emit(DND_EVENT.DROP, {
                clientPosition: this.clientPosition,
                item: this.dnd.getDraggingItem(),
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

            this.emit(DND_EVENT.DRAG_OVER, {
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

            this.emit(DND_EVENT.DRAG_LEAVE, {
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

        this.emit(DND_EVENT.DRAG_OVER, {
            clientPosition: this.clientPosition,
            item: this.dnd.getDraggingItem(),
        });
    }

    private onDragleave(event: DragEvent) {
        this.clientPosition = {
            x: event.clientX,
            y: event.clientY,
        };

        this.emit(DND_EVENT.DRAG_LEAVE, {
            clientPosition: this.clientPosition,
            item: this.dnd.getDraggingItem(),
        });
    }

    private onDrop(event: DragEvent) {
        console.debug("[Debug] dnd onDrop", this.dnd.getDraggingItem());
        this.clientPosition = {
            x: event.clientX,
            y: event.clientY,
        };

        this.emit(DND_EVENT.DROP, {
            clientPosition: this.clientPosition,
            item: this.dnd.getDraggingItem(),
        });

        this.clientPosition = null;
    }

    public removeEleListeners() {
        ((this.el as any) as HTMLElement).removeEventListener(
            "dragover",
            this.onDragover
        );
        ((this.el as any) as HTMLElement).removeEventListener(
            "dragleave",
            this.onDragleave
        );
        ((this.el as any) as HTMLElement).removeEventListener(
            "drop",
            this.onDrop
        );
        ((this.el as any) as HTMLElement).addEventListener(
            "mouseup",
            this.onMouseUp as EventListener
        );
        ((this.el as any) as HTMLElement).addEventListener(
            "mousemove",
            this.onMouseMove as EventListener
        );
        ((this.el as any) as HTMLElement).addEventListener(
            "mouseleave",
            this.onMouseLeave as EventListener
        );
        return this;
    }
}

export default DropListenable;
