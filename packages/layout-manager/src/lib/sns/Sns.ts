import { SLOT_EVENT } from "src/enum";
import { ADD_PANEL_DATA, MOVE_PANEL_DATA, MOVE_SPLITTER_DATA, REMOVE_PANEL_DATA, SELECT_TAB_DATA } from "src/type";

import Slot from "./Slot";


interface Sns {
    send(target: string | number, event: SLOT_EVENT.ADD_PANEL, data: ADD_PANEL_DATA): this;
    send(target: string | number, event: SLOT_EVENT.MOVE_PANEL, data: MOVE_PANEL_DATA): this;
    send(target: string | number, event: SLOT_EVENT.MOVE_SPLITTER, data: MOVE_SPLITTER_DATA): this;
    send(target: string | number, event: SLOT_EVENT.REMOVE_PANEL, data: REMOVE_PANEL_DATA): this;
    send(target: string | number, event: SLOT_EVENT.SELECT_TAB, data: SELECT_TAB_DATA): this;
}
class Sns {
    private slots: Slot[] = [];
    public setSlot(id: string | number) {
        const slot = this.slots.find((slot) => slot.id === id);

        if (slot == null) {
            const slot = new Slot(id);
            this.slots.push(slot);
            return slot;
        }
        return slot;
    }

    public send(target: string | number, event: string | symbol, data?: any) {
        this.slots.find((slot) => slot.id === target)?.emit(event, data);
        return this;
    }

    public broadcast(event: string | symbol, data?: any) {
        console.debug("[Debug] broadcast")
        this.slots.forEach(s => s.emit(event, data))
    };
}

export default Sns;
