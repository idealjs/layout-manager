import EventEmitter from "events";

import { SLOT_EVENT } from "../../enum";

interface Slot {
    addListener(event: SLOT_EVENT.ADD_PANEL, listener: (...args: any[]) => void): this;
    addListener(event: SLOT_EVENT.MOVE_PANEL, listener: (...args: any[]) => void): this;
    addListener(event: SLOT_EVENT.MOVE_SPLITTER, listener: (...args: any[]) => void): this;
    addListener(event: SLOT_EVENT.REMOVE_PANEL, listener: (...args: any[]) => void): this;
    addListener(event: SLOT_EVENT.SELECT_TAB, listener: (...args: any[]) => void): this;
    addListener(event: string | symbol, listener: (...args: any[]) => void): this;
}

class Slot extends EventEmitter {
    public id: string | number;
    constructor(id: string | number) {
        super();
        this.id = id;
    }

}

export default Slot;
