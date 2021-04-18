import EventEmitter from "events";

class Slot extends EventEmitter {
    public id: string | number;
    constructor(id: string | number) {
        super();
        this.id = id;
    }
}

export default Slot;
