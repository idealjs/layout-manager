import { Slot } from "@idealjs/sns";

import createNode from "../graph/createNode";
import { updateSymbol } from "./createAction";
import { IEvent } from "./createEvent";
import { defaultScope, Scope } from "./createScope";

interface ISubscribeListener<State> {
    (state: State): void;
}

interface IUnSubscribe {
    (): void;
}

class Store<State> {
    private state: State;
    public scope: Scope;
    public slot: Slot;
    private listeners: WeakMap<Slot, (...args: any[]) => void> = new WeakMap();
    constructor(initialState: State, scope: Scope = defaultScope) {
        this.state = initialState;
        this.scope = scope;
        this.slot = this.scope.createSlot();
    }

    public on<Payload = unknown>(
        unit: Store<Payload> | IEvent<unknown[], Payload, unknown>,
        listener: (state: State, payload: Payload) => State
    ) {
        unit.slot.addListener(updateSymbol, listener);
        this.listeners.set(this.slot, listener);
        this.scope.graph.addEdge(this, createNode(this, listener));
        return this;
    }

    public off(unit: { slot: Slot }) {
        const _listener = this.listeners.get(unit.slot);
        if (_listener) {
            unit.slot.removeListener(updateSymbol, _listener);
            this.listeners.delete(unit.slot);
            this.scope.graph.removeEdge(this, unit);
        }
        return this;
    }

    public getState(): State {
        return this.state;
    }

    public subscribe(listener: ISubscribeListener<State>): IUnSubscribe {
        this.slot.addListener(updateSymbol, listener);
        return () => {
            this.slot.removeListener(updateSymbol, listener);
        };
    }
}

export default Store;
