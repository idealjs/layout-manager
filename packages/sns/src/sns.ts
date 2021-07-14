import Slot, { SlotId } from "src/slot";

export const SnsUpdate = Symbol("SnsUpdate");

class Sns {
    private slots: Readonly<Slot>[] = [];

    public setSlot(slotId: SlotId): Slot {
        let slot = this.slots.find((s) => s.id === slotId);
        if (slot == null) {
            slot = new Slot(slotId);
            this.addSlot(slot);
        }
        return slot;
    }

    public addSlot(slot: Slot) {
        this.slots = this.slots.filter((s) => s !== slot).concat(slot);
        return this;
    }

    public removeSlot(slot: Slot) {
        this.slots = this.slots.filter((s) => s !== slot);
        return this;
    }

    public find(id: SlotId) {
        return this.slots.find((slot) => slot.id === id);
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
