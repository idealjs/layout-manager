import EventEmitter from "events";
import Slot, { SlotId } from "src/slot";

export const SnsUpdate = Symbol("SnsUpdate");

class Sns extends EventEmitter {
    private slots: Readonly<Slot>[] = [];

    public addSlot(slot: Slot) {
        this.slots = this.slots.concat(slot);
        this.emit(SnsUpdate)
        return this;
    }

    public removeSlot(slot: Slot) {
        this.slots = this.slots.filter((s) => s !== slot);
        this.emit(SnsUpdate)
        return this;
    }

    public find(id: SlotId) {
        return this.slots.find((slot) => slot.id === id)
    }

    public send(target: SlotId, event: string | symbol, data?: any) {
        console.debug("[Debug] send");
        this.slots.find((slot) => slot.id === target)?.emit(event, data);
        return this;
    }

    public broadcast(event: string | symbol, data?: any) {
        console.debug("[Debug] broadcast");
        this.slots.forEach((s) => s.emit(event, data));
        return this;
    }
}

export default Sns;
