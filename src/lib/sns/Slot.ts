import EventEmitter from "events";

class Slot extends EventEmitter {
    public id: symbol;
    constructor(id: symbol) {
        super();
        this.id = id;
    }
}

export default Slot;
