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
import CommonStore from "./CommonStore";

export interface IUnitOptions {
    id?: string | number | symbol;
    scope?: CommonScope;
    type?: UNIT_TYPE;
}

class CommonUnit<Params extends unknown[], Done, Faild> {
    private effect: Effect<Params, Done, Faild>;
    private listeners: WeakMap<Slot, (...args: any[]) => void> = new WeakMap();
    private unitOptions: IUnitOptions;
    public scope: CommonScope;
    public slot: Slot;
    public type: UNIT_TYPE;
    constructor(
        effect: Effect<Params, Done, Faild>,
        unitOptions: IUnitOptions
    ) {
        this.effect = effect;
        this.unitOptions = unitOptions;
        this.type = this.unitOptions.type ?? UNIT_TYPE.UNIT;
        this.scope = this.unitOptions.scope ?? defaultScope;
        this.slot = this.scope.createSlot(unitOptions.id);
        this.scope.setUnit(this.slot.id, this);

        this.on = this.on.bind(this);
        this.off = this.off.bind(this);
        this.fork = this.fork.bind(this);
    }

    public on<TParams extends unknown[], TDone, TFaild>(
        target:
            | CommonUnit<TParams, TDone, TFaild>
            | CommonEvent<TDone>
            | CommonStore<TDone>,
        eventName: typeof startSymbol,
        listener: () => void
    ): this;

    public on<TParams extends unknown[], TDone, TFaild>(
        target:
            | CommonUnit<TParams, TDone, TFaild>
            | CommonEvent<TDone>
            | CommonStore<TDone>,
        eventName: typeof doneSymbol,
        listener: (payload: TDone) => void
    ): this;

    public on<TParams extends unknown[], TDone, TFaild>(
        target:
            | CommonUnit<TParams, TDone, TFaild>
            | CommonEvent<TDone>
            | CommonStore<TDone>,
        eventName: typeof faildSymbol,
        listener: (payload: TFaild) => void
    ): this;

    public on<TParams extends unknown[], TDone, TFaild>(
        target:
            | CommonUnit<TParams, TDone, TFaild>
            | CommonEvent<TDone>
            | CommonStore<TDone>,
        listener: (payload: TDone) => void
    ): this;

    public on<TParams extends unknown[], TDone, TFaild>(
        target: CommonUnit<TParams, TDone, TFaild>,
        listenerOrEvent:
            | ((
                  this: CommonUnit<Params, Done, Faild>,
                  payload?: TDone | TFaild
              ) => void)
            | (string | symbol),
        listener?: (
            this: CommonUnit<Params, Done, Faild>,
            payload?: TDone | TFaild
        ) => void
    ) {
        if (typeof listenerOrEvent === "function") {
            target.slot.addListener(updateSymbol, listenerOrEvent);
            this.listeners.set(target.slot, listenerOrEvent);
            this.scope.graph.addEdge(
                this,
                new CommonNode(target, listenerOrEvent)
            );
        } else if (listener) {
            target.slot.addListener(listenerOrEvent, listener);
            this.listeners.set(target.slot, listener);
            this.scope.graph.addEdge(
                this,
                new CommonNode(target, listenerOrEvent)
            );
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
            this.scope.sns.send(this.slot.id, faildSymbol, error as Faild);
        }
    }

    public fork(scope: CommonScope) {
        return new CommonUnit(this.effect, {
            ...this.unitOptions,
            id: this.slot.id,
            scope,
        });
    }
}

export default CommonUnit;
