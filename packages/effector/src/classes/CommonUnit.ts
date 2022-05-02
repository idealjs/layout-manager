import { Slot } from "@idealjs/sns";

import {
    doneSymbol,
    Effect,
    faildSymbol,
    startSymbol,
    UNIT_TYPE,
    updateSymbol,
} from "../creator/createUnit";
import CommonEvent from "./CommonEvent";
import CommonNode from "./CommonNode";
import CommonScope, { defaultScope } from "./CommonScope";
import CommonStore, { isCommonStore } from "./CommonStore";

export interface IUnitOptions {
    id?: string | number | symbol;
    scope?: CommonScope;
    type?: UNIT_TYPE;
    forkCounter?: number;
}

class CommonUnit<Params extends unknown[], Done, Faild> {
    private effect: Effect<Params, Done, Faild>;
    private listeners: WeakMap<Slot, (...args: any[]) => void> = new WeakMap();
    private unitOptions: IUnitOptions;
    public scope: CommonScope;
    public slot: Slot;
    public type: UNIT_TYPE;
    public forkCounter: number;

    constructor(
        effect: Effect<Params, Done, Faild>,
        unitOptions: IUnitOptions
    ) {
        this.effect = effect;
        this.unitOptions = unitOptions;
        this.type = this.unitOptions.type ?? UNIT_TYPE.UNIT;
        this.scope = this.unitOptions.scope ?? defaultScope;
        this.forkCounter =
            this.unitOptions.forkCounter != null
                ? this.unitOptions.forkCounter + 1
                : 0;
        this.slot = this.scope.createSlot(unitOptions.id);
        this.scope.setUnit(this.slot.id, this);

        this.on = this.on.bind(this);
        this.off = this.off.bind(this);
        this.fork = this.fork.bind(this);
        this.runUnit = this.runUnit.bind(this as any);
    }

    public on<TParams extends unknown[], TDone, TFaild>(
        target: CommonUnit<TParams, TDone, TFaild>,
        eventName: typeof startSymbol,
        listener: () => void
    ): this;

    public on<TParams extends unknown[], TDone, TFaild>(
        target: CommonUnit<TParams, TDone, TFaild>,
        eventName: typeof doneSymbol,
        listener: (payload: TDone) => void
    ): this;

    public on<TParams extends unknown[], TDone, TFaild>(
        target: CommonUnit<TParams, TDone, TFaild>,
        eventName: typeof faildSymbol,
        listener: (payload: TFaild) => void
    ): this;

    public on<TParams extends unknown[], TDone, TFaild, TState>(
        target:
            | CommonUnit<TParams, TDone, TFaild>
            | CommonEvent<TDone>
            | CommonStore<TState>,
        listener: (payload: TDone | TFaild) => void
    ): this;

    public on<TParams extends unknown[], TDone, TFaild, TState>(
        target:
            | CommonUnit<TParams, TDone, TFaild>
            | CommonEvent<TDone>
            | CommonStore<TState>,
        listener: (
            _this:
                | CommonUnit<TParams, TDone, TFaild>
                | CommonEvent<TDone>
                | CommonStore<TState>,
            payload: TDone | TFaild
        ) => void
    ): this;

    public on<TParams extends unknown[], TDone, TFaild, TState>(
        target:
            | CommonUnit<TParams, TDone, TFaild>
            | CommonEvent<TDone>
            | CommonStore<TState>,
        listenerOrEvent:
            | ((
                  _this:
                      | CommonUnit<TParams, TDone, TFaild>
                      | CommonEvent<TDone>
                      | CommonStore<TState>,
                  payload?: TDone | TFaild
              ) => void)
            | (string | symbol),
        listener?: (payload: TDone | TFaild) => void
    ) {
        let unit:
            | CommonUnit<TParams, TDone, TFaild>
            | CommonUnit<TState[], TState, never>
            | CommonEvent<TDone>;

        if (isCommonStore(target)) {
            unit = target.unit;
        } else {
            unit = target;
        }

        const eventName =
            typeof listenerOrEvent === "function"
                ? updateSymbol
                : listenerOrEvent;

        let _listener =
            typeof listenerOrEvent === "function" ? listenerOrEvent : listener;

        if (_listener) {
            unit.slot.addListener(eventName, _listener);
            this.listeners.set(unit.slot, _listener);
            this.scope.graph.addEdge(this, new CommonNode(unit, _listener));
        } else {
            throw new Error("listener is required");
        }

        return this;
    }

    public off<TParams extends unknown[], TDone, TFaild>(
        target: CommonUnit<TParams, TDone, TFaild>
    ) {
        const _listener = this.listeners.get(target.slot);
        if (_listener) {
            target.slot.removeListener(updateSymbol, _listener);
            this.listeners.delete(target.slot);
            this.scope.graph.removeEdge(this, target);
        }
        return this;
    }

    public async runUnit(...params: Params) {
        try {
            this.scope.sns.send(this.slot.id, startSymbol);
            let done = await this.effect(...params);
            this.scope.sns.send(this.slot.id, doneSymbol, done);
            this.scope.sns.send(this.slot.id, updateSymbol, done);
        } catch (error) {
            console.error(error);
            this.scope.sns.send(this.slot.id, faildSymbol, error as Faild);
        }
    }

    public fork(scope: CommonScope) {
        return new CommonUnit(this.effect, {
            ...this.unitOptions,
            id: this.slot.id,
            forkCounter: this.forkCounter,
            scope,
        });
    }
}

export default CommonUnit;
