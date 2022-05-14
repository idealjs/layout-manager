import { Slot } from "@idealjs/sns";

import { UNIT_TYPE, updateSymbol } from "../creator/createUnit";
import { IEvent } from "./CommonEvent";
import CommonNode from "./CommonNode";
import CommonScope from "./CommonScope";
import CommonUnit, { IUnitOptions } from "./CommonUnit";

interface ISubscribeListener<State> {
    (state: State): void;
}

interface IUnSubscribe {
    (): void;
}

export interface IStore<State> {
    readonly unit: CommonUnit<State[], State, never>;

    on<TDone, TState>(
        target: IEvent<TDone> | IStore<TState>,
        listener: (state: State, payload: TDone | TState) => State
    ): this;

    off<TDone, TState>(target: IEvent<TDone> | IStore<TState>): this;

    getState(): State;

    subscribe(listener: ISubscribeListener<State>): IUnSubscribe;

    fork(scope: CommonScope): IStore<State>;
}

class CommonStore<State> implements IStore<State> {
    readonly unit: CommonUnit<State[], State, never>;

    #state: State;
    #listeners: WeakMap<Slot, (...args: any[]) => void> = new WeakMap();

    constructor(initialState: State, unitOptions: IUnitOptions = {}) {
        this.#state = initialState;

        this.unit = new CommonUnit<State[], State, never>((p) => p, {
            type: UNIT_TYPE.STORE,
            ...unitOptions,
        });

        this.unit.scope.setStore(this.unit.slot.id, this);

        this.on = this.on.bind(this);
        this.off = this.off.bind(this);
        this.getState = this.getState.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.fork = this.fork.bind(this);
    }

    on<TState>(
        target: IStore<TState>,
        listener: (state: State, payload: TState) => State
    ): this;

    on<TDone>(
        target: IEvent<TDone>,
        listener: (state: State, payload: TDone) => State
    ): this;

    on<TDone, TState>(
        target: IEvent<TDone> | IStore<TState>,
        listener: (state: State, payload: TDone | TState) => State
    ) {
        let unit: IEvent<TDone> | IEvent<TState>;

        if (isCommonStore(target)) {
            unit = target.unit;
        } else {
            unit = target;
        }

        const _listener = (payload: TDone) => {
            this.#state = listener(this.#state, payload);
            this.unit.runUnit(this.#state);
        };

        unit.slot.addListener(updateSymbol, _listener);

        this.#listeners.set(unit.slot, _listener);

        this.unit.scope.graph.addEdge(
            this.unit,
            new CommonNode(unit, listener)
        );

        return this;
    }

    off<TDone, TState>(target: IEvent<TDone> | IStore<TState>) {
        let unit: IEvent<TDone> | IEvent<TState>;

        if (isCommonStore(target)) {
            unit = target.unit;
        } else {
            unit = target;
        }

        const _listener = this.#listeners.get(unit.slot);
        if (_listener) {
            unit.slot.removeListener(updateSymbol, _listener);
            this.#listeners.delete(unit.slot);
            this.unit.scope.graph.removeEdge(this.unit, unit);
        }
        return this;
    }

    getState(): State {
        return this.#state;
    }

    subscribe(listener: ISubscribeListener<State>): IUnSubscribe {
        this.unit.slot.addListener(updateSymbol, listener);
        return () => {
            this.unit.slot.removeListener(updateSymbol, listener);
        };
    }

    fork(scope: CommonScope): IStore<State> {
        return new CommonStore(this.#state, {
            ...this.unit.unitOptions,
            id: this.unit.slot.id,
            scope,
            forkCounter: this.unit.unitOptions.forkCounter
                ? this.unit.unitOptions.forkCounter + 1
                : 1,
        });
    }
}

export default CommonStore;

export const isCommonStore = <TDone, TState>(
    store: IEvent<TDone> | IStore<TState>
): store is IStore<TState> => {
    if ("unit" in store) {
        return true;
    }
    return false;
};
