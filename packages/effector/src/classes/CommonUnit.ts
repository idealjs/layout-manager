import { Slot } from "@idealjs/sns";

import {
    doneSymbol,
    Effect,
    faildSymbol,
    startSymbol,
    UNIT_TYPE,
    updateSymbol,
} from "../creator/createUnit";
import CommonNode from "./CommonNode";
import CommonScope, { defaultScope } from "./CommonScope";

export interface IUnitOptions {
    id?: string | number | symbol;
    scope?: CommonScope;
    type?: UNIT_TYPE;
    forkCounter?: number;
}

export interface IUnit<Params extends unknown[], Done, Faild> {
    readonly effect: Effect<Params, Done, Faild>;
    readonly unitOptions: IUnitOptions;

    scope: CommonScope;
    slot: Slot;

    on<TParams extends unknown[], TDone, TFaild>(
        target: IUnit<TParams, TDone, TFaild>,
        listenerOrEvent:
            | string
            | symbol
            | ((
                  _this: IUnit<TParams, TDone, TFaild>,
                  payload?: TDone | TFaild | undefined
              ) => void),
        listener?: ((payload: TDone | TFaild) => void) | undefined
    ): this;

    off<TParams extends unknown[], TDone, TFaild>(
        target: CommonUnit<TParams, TDone, TFaild>
    ): this;

    runUnit(...params: Params): Promise<void>;

    fork(scope: CommonScope): IUnit<Params, Done, Faild>;
}

class CommonUnit<Params extends unknown[], Done, Faild>
    implements IUnit<Params, Done, Faild>
{
    readonly effect: Effect<Params, Done, Faild>;
    readonly unitOptions: IUnitOptions;

    #listeners: WeakMap<Slot, (...args: any[]) => void> = new WeakMap();

    scope: CommonScope;
    slot: Slot;

    constructor(
        effect: Effect<Params, Done, Faild>,
        unitOptions: IUnitOptions
    ) {
        this.effect = effect;
        this.unitOptions = {
            scope: defaultScope,
            type: UNIT_TYPE.UNIT,
            forkCounter: 0,
            ...unitOptions,
        };
        this.scope = this.unitOptions.scope ?? defaultScope;
        if (unitOptions.id != null && this.scope.hasUnit(unitOptions.id)) {
            throw new Error(
                `Has already set with id: ${unitOptions.id.toString()} `
            );
        }

        this.slot = this.scope.createSlot(unitOptions.id);
        this.scope.setUnit(this.slot.id, this);

        this.on = this.on.bind(this);
        this.off = this.off.bind(this);
        this.fork = this.fork.bind(this);
        this.runUnit = this.runUnit.bind(this as any);
    }

    on<TParams extends unknown[], TDone, TFaild>(
        target: IUnit<TParams, TDone, TFaild>,
        eventName: typeof startSymbol,
        listener: () => void
    ): this;

    on<TParams extends unknown[], TDone, TFaild>(
        target: IUnit<TParams, TDone, TFaild>,
        eventName: typeof doneSymbol,
        listener: (payload: TDone) => void
    ): this;

    on<TParams extends unknown[], TDone, TFaild>(
        target: IUnit<TParams, TDone, TFaild>,
        eventName: typeof faildSymbol,
        listener: (payload: TFaild) => void
    ): this;

    on<TParams extends unknown[], TDone, TFaild>(
        target: IUnit<TParams, TDone, TFaild>,
        listener: (payload: TDone | TFaild) => void
    ): this;

    on<TParams extends unknown[], TDone, TFaild>(
        target: IUnit<TParams, TDone, TFaild>,
        listenerOrEvent:
            | ((
                  _this: IUnit<TParams, TDone, TFaild>,
                  payload?: TDone | TFaild
              ) => void)
            | (string | symbol),
        listener?: (payload: TDone | TFaild) => void
    ) {
        const eventName =
            typeof listenerOrEvent === "function"
                ? updateSymbol
                : listenerOrEvent;

        let _listener =
            typeof listenerOrEvent === "function" ? listenerOrEvent : listener;

        if (_listener) {
            target.slot.addListener(eventName, _listener);
            this.#listeners.set(target.slot, _listener);
            this.scope.graph.addEdge(this, new CommonNode(target, _listener));
        } else {
            throw new Error("listener is required");
        }

        return this;
    }

    off<TParams extends unknown[], TDone, TFaild>(
        target: IUnit<TParams, TDone, TFaild>
    ) {
        const _listener = this.#listeners.get(target.slot);
        if (_listener) {
            target.slot.removeListener(updateSymbol, _listener);
            this.#listeners.delete(target.slot);
            this.scope.graph.removeEdge(this, target);
        }
        return this;
    }

    async runUnit(...params: Params) {
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

    fork(scope: CommonScope): IUnit<Params, Done, Faild> {
        return new CommonUnit(this.effect, {
            ...this.unitOptions,
            id: this.slot.id,
            forkCounter: this.unitOptions.forkCounter
                ? this.unitOptions.forkCounter + 1
                : 1,
            scope,
        });
    }
}

export default CommonUnit;
