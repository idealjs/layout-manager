import { UNIT_TYPE } from "../creator/createUnit";
import { IEvent } from "./CommonEvent";
import CommonGraph from "./CommonGraph";
import CommonNode from "./CommonNode";
import CommonScope from "./CommonScope";
import CommonStore from "./CommonStore";
import { IUnitOptions } from "./CommonUnit";

class CommonMachine<State> extends CommonStore<State> {
    graph = new CommonGraph();
    constructor(initialState: State, unitOptions: IUnitOptions = {}) {
        super(initialState, {
            type: UNIT_TYPE.MACHINE,
            ...unitOptions,
        });
        this.register = this.register.bind(this);
        this.unRegister = this.unRegister.bind(this);
    }

    register<TDone>(event: IEvent<TDone>, state: State) {
        this.on(event, () => state);
        this.graph.addEdge(this.unit, new CommonNode(event, state));
        return this;
    }

    unRegister<TDone>(event: IEvent<TDone>) {
        this.off(event);
        this.graph.removeEdge(this.unit, event);
        return this;
    }

    fork(scope: CommonScope) {
        return new CommonMachine(this.getState(), {
            ...this.unit.unitOptions,
            id: this.unit.slot.id,
            scope,
            forkCounter: this.unit.unitOptions.forkCounter
                ? this.unit.unitOptions.forkCounter + 1
                : 1,
        });
    }
}

export default CommonMachine;
