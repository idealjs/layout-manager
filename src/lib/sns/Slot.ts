import EventEmitter from "events";

import { SLOT_EVENT } from "../../enum";
import { ADD_PANEL_DATA, MOVE_PANEL_DATA, MOVE_SPLITTER_DATA, REMOVE_PANEL_DATA, SELECT_TAB_DATA } from "../type";



interface Slot {
    addListener(event: SLOT_EVENT.ADD_PANEL, listener: (data: ADD_PANEL_DATA) => void): this;
    addListener(event: SLOT_EVENT.MOVE_PANEL, listener: (data: MOVE_PANEL_DATA) => void): this;
    addListener(event: SLOT_EVENT.MOVE_SPLITTER, listener: (data: MOVE_SPLITTER_DATA) => void): this;
    addListener(event: SLOT_EVENT.REMOVE_PANEL, listener: (data: REMOVE_PANEL_DATA) => void): this;
    addListener(event: SLOT_EVENT.SELECT_TAB, listener: (data: SELECT_TAB_DATA) => void): this;
    // addListener(event: string | symbol, listener: (...args: any[]) => void): this;
}

class Slot extends EventEmitter {
    public id: string | number;
    constructor(id: string | number) {
        super();
        this.id = id;
    }

}

export default Slot;
