import Slot, { SlotId } from "./slot";

class Sns {
    private slots: { [slotId: SlotId]: Slot | undefined } = {};

    public setSlot(slotId: SlotId): Slot {
        let slot = this.slots[slotId];
        if (!slot) {
            slot = new Slot(slotId);
            this.slots[slotId] = slot;
        }
        return slot;
    }

    public removeSlot(slotId: SlotId) {
        delete this.slots[slotId];
        return this;
    }

    public find(slotId: SlotId) {
        return this.slots[slotId];
    }

    public send(target: SlotId, event: string | symbol, data?: any) {
        console.debug("[Debug] send", target, event, data, this.slots[target]);
        this.slots[target]?.emit(event, data);
        return this;
    }

    public broadcast(event: string | symbol, data?: any) {
        console.debug("[Debug] broadcast");
        Object.values(this.slots).forEach((slot) => slot?.emit(event, data));
        return this;
    }
}

export default Sns;
