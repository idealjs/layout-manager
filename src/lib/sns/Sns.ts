import Slot from "./Slot";

class Sns {
    private slots: Slot[] = [];
    setSlot(id: Symbol) {
        const slot = this.slots.find((slot) => slot.id === id);
        if (slot == null) {
            const slot = new Slot(id);
            this.slots.push(slot);
            return slot;
        }
        return slot;
    }

    send(target: Symbol, event: string | symbol, data: any) {
        console.log("send", this.slots);
        this.slots
            .find((slot) => {
                console.log(
                    "test test",
                    slot,
                    slot.id,
                    target,
                    slot.id === target
                );
                return slot.id === target;
            })
            ?.emit(event, data);
    }
}

export default Sns;
