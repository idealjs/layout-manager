import EventEmitter from "events";

class Slot extends EventEmitter {
    public id: Symbol;
    constructor(id: Symbol) {
        super();
        this.id = id;
    }
}

export default Slot;
