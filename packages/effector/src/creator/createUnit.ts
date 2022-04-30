import { Slot } from "@idealjs/sns";

import createNode from "../graph/createNode";
import { defaultScope, Scope } from "./createScope";

export const startSymbol = Symbol("start");
export const doneSymbol = Symbol("done");
export const faildSymbol = Symbol("faild");
export const updateSymbol = Symbol("update");

export interface IUnit<
    OutParams extends unknown[],
    OutDone,
    OutFaild,
    OutEffect extends Effect<OutParams, OutDone, OutFaild>
> {
    (...params: Parameters<OutEffect>): Promise<void>;
    scope: Scope;
    slot: Slot;
    type: UNIT_TYPE;
    on<
        TParams extends unknown[],
        TDone,
        TFaild,
        TEffect extends Effect<TParams, TDone, TFaild>
    >(
        target: IUnit<TParams, TDone, TFaild, TEffect>,
        listenerOrEvent:
            | ((payload?: TDone | TFaild) => void)
            | (string | symbol),
        listener?: (payload?: TDone | TFaild) => void
    ): IUnit<OutParams, OutDone, OutFaild, OutEffect>;

    off<
        TParams extends unknown[],
        TDone,
        TFaild,
        TEffect extends Effect<TParams, TDone, TFaild>
    >(
        target: IUnit<TParams, TDone, TFaild, TEffect>
    ): IUnit<OutParams, OutDone, OutFaild, OutEffect>;

    fork(scope: Scope): IUnit<OutParams, OutDone, OutFaild, OutEffect>;
}

export enum UNIT_TYPE {
    STORE = "STORE",
    EVENT = "EVENT",
    INTERNAL_EVENT = "INTERNAL_EVENT",
    UNIT = "UNIT",
}

export interface IUnitOptions {
    name?: string;
    id?: string | number | symbol;
    scope?: Scope;
    type: UNIT_TYPE;
}

export type Effect<Params extends unknown[], Done, Faild> = (
    ...params: Params
) => Done | Promise<Done> | Faild;

function createUnit<
    Params extends unknown[] = unknown[],
    Done = unknown,
    Faild = unknown
>(
    effect: Effect<Params, Done, Faild>,
    unitOptions: IUnitOptions = { type: UNIT_TYPE.UNIT }
) {
    const scope = unitOptions?.scope ?? defaultScope;
    const slot = scope.createSlot(unitOptions?.id);

    const listeners: WeakMap<Slot, (...args: any[]) => void> = new WeakMap();

    const on = <
        TParams extends unknown[],
        TDone,
        TFaild,
        TEffect extends Effect<TParams, TDone, TFaild>
    >(
        target: IUnit<TParams, TDone, TFaild, TEffect>,
        listenerOrEvent:
            | ((payload?: TDone | TFaild) => void)
            | (string | symbol),
        listener?: (payload?: TDone | TFaild) => void
    ) => {
        if (typeof listenerOrEvent === "function") {
            target.slot.addListener(updateSymbol, listenerOrEvent);
            listeners.set(target.slot, listenerOrEvent);
            scope.graph.addEdge(unit, createNode(target, listenerOrEvent));
        } else if (listener) {
            target.slot.addListener(listenerOrEvent, listener);
            listeners.set(target.slot, listener);
            scope.graph.addEdge(unit, createNode(target, listener));
        } else {
            throw new Error("listener is required");
        }

        return unit;
    };

    const off = <
        TParams extends unknown[],
        TDone,
        TFaild,
        TEffect extends Effect<TParams, TDone, TFaild>
    >(
        target: IUnit<TParams, TDone, TFaild, TEffect>
    ) => {
        const _listener = listeners.get(target.slot);
        if (_listener) {
            target.slot.removeListener(updateSymbol, _listener);
            listeners.delete(target.slot);
            scope.graph.removeEdge(unit, target);
        }
        return unit;
    };

    const fork = (scope: Scope) => {
        return createUnit(effect, { ...unitOptions, id: slot.id, scope });
    };

    const unit: IUnit<
        Params,
        Done,
        Faild,
        Effect<Params, Done, Faild>
    > = Object.assign(
        async (...params: Params) => {
            try {
                scope.sns.send(slot.id, startSymbol);
                let done = await effect(...params);
                scope.sns.send(slot.id, doneSymbol, done);
                scope.sns.send(slot.id, updateSymbol, done);
            } catch (error) {
                scope.sns.send(slot.id, faildSymbol, error as Faild);
            }
        },
        {
            scope,
            slot,
            on,
            off,
            fork,
        },
        unitOptions
    );

    scope.setUnit(unit.slot.id, unit);

    return unit;
}

export default createUnit;
