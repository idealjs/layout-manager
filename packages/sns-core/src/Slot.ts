import EventEmitter from "events";

import { SlotId } from "./type";

class Slot extends EventEmitter {
    public id: SlotId;
    constructor(id: SlotId) {
        super();
        this.id = id;
    }
}

export default Slot;
