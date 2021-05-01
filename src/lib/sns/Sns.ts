import { SLOT_EVENT } from "../../enum";
import Slot from "./Slot";

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

    public send(target: string | number, event: SLOT_EVENT.ADD_PANEL, data: any): this;
    public send(target: string | number, event: SLOT_EVENT.MOVE_PANEL, data: any): this;
    public send(target: string | number, event: SLOT_EVENT.MOVE_SPLITTER, data: any): this;
    public send(target: string | number, event: SLOT_EVENT.REMOVE_PANEL, data: any): this;
    public send(target: string | number, event: SLOT_EVENT.SELECT_TAB, data: any): this;
    public send(target: string | number, event: string, data?: any): this;

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
