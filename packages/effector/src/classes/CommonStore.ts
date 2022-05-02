import { Slot } from "@idealjs/sns";

import { UNIT_TYPE, updateSymbol } from "../creator/createUnit";
import CommonEvent from "./CommonEvent";
import CommonNode from "./CommonNode";
import CommonScope from "./CommonScope";
import CommonUnit, { IUnitOptions } from "./CommonUnit";

interface ISubscribeListener<State> {
    (state: State): void;
}

interface IUnSubscribe {
    (): void;
}

class CommonStore<State> {
    private state: State;
    private unitOptions: Omit<IUnitOptions, "type">;
    public unit: CommonUnit<State[], State, never>;
    public forkCounter: number;
    private listeners: WeakMap<Slot, (...args: any[]) => void> = new WeakMap();

    constructor(
        initialState: State,
        unitOptions: Omit<IUnitOptions, "type"> = {}
    ) {
        this.state = initialState;
        this.unitOptions = unitOptions;
        this.forkCounter =
            this.unitOptions.forkCounter != null
                ? this.unitOptions.forkCounter + 1
                : 0;

        this.unit = new CommonUnit<State[], State, never>((p) => p, {
            ...unitOptions,
            type: UNIT_TYPE.STORE,
            forkCounter: this.unitOptions.forkCounter,
        });

        this.unit.scope.setStore(this.unit.slot.id, this);

        this.on = this.on.bind(this);
        this.off = this.off.bind(this);
        this.getState = this.getState.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.fork = this.fork.bind(this);
    }

    public static getStoreListener<State, TDone, TFaild>(
        store: CommonStore<State>,
        listener: (state: State, payload: TDone | TFaild) => State
    ) {
        return (payload: TDone | TFaild) => {
            store.state = listener(store.state, payload);
            store.unit.runUnit(store.state);
        };
    }

    public on<TParams extends unknown[], TDone, TFaild>(
        target:
            | CommonUnit<TParams, TDone, TFaild>
            | CommonEvent<TDone>
            | CommonStore<State>,
        listener: (state: State, payload: TDone | TFaild) => State
    ) {
        let unit:
            | CommonUnit<TParams, TDone, TFaild>
            | CommonUnit<State[], State, never>
            | CommonEvent<TDone>;

        if (isCommonStore(target)) {
            unit = target.unit;
        } else {
            unit = target;
        }

        const _listener = CommonStore.getStoreListener(this, listener);

        unit.slot.addListener(updateSymbol, _listener);

        this.listeners.set(unit.slot, _listener);

        this.unit.scope.graph.addEdge(
            this.unit,
            new CommonNode(unit, listener)
        );

        return this;
    }

    public off<TParams extends unknown[], TDone, TFaild>(
        target: CommonUnit<TParams, TDone, TFaild>
    ) {
        const _listener = this.listeners.get(target.slot);
        if (_listener) {
            target.slot.removeListener(updateSymbol, _listener);
            this.listeners.delete(target.slot);
            this.unit.scope.graph.removeEdge(this.unit, target);
        }
        return this;
    }

    public getState(): State {
        return this.state;
    }

    public subscribe(listener: ISubscribeListener<State>): IUnSubscribe {
        this.unit.slot.addListener(updateSymbol, listener);
        return () => {
            this.unit.slot.removeListener(updateSymbol, listener);
        };
    }

    public fork(scope: CommonScope) {
        return new CommonStore(this.state, {
            ...this.unitOptions,
            id: this.unit.slot.id,
            scope,
            forkCounter: this.forkCounter,
        });
    }
}

export default CommonStore;

export const isCommonStore = <TParams extends unknown[], TDone, TFaild, TState>(
    store:
        | CommonUnit<TParams, TDone, TFaild>
        | CommonEvent<TDone>
        | CommonStore<TState>
): store is CommonStore<TState> => {
    if ("unit" in store) {
        return true;
    }
    return false;
};
