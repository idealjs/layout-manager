
import Slot from "src/slot";

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
