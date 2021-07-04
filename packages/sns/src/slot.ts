import EventEmitter from "events";

export type SlotId = string | number | symbol;

class Slot extends EventEmitter {
    public id: SlotId;
    constructor(id: SlotId) {
        super();
        this.id = id;
    }
}

export default Slot;
