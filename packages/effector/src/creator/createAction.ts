import { Slot } from "@idealjs/sns";

import { defaultScope, Scope } from "./createScope";

export const startSymbol = Symbol("start");
export const doneSymbol = Symbol("done");
export const faildSymbol = Symbol("faild");
export const updateSymbol = Symbol("update");

export interface IAction<
    Params extends unknown[],
    Done,
    Faild,
    E extends Effect<Params, Done, Faild>
> {
    (...params: Parameters<E>): Promise<void>;
    scope: Scope;
    slot: Slot;
}

export type Effect<Params extends unknown[], Done, Faild> = (
    ...params: Params
) => Done | Promise<Done> | Faild;

function createAction<
    Params extends unknown[] = unknown[],
    Done = unknown,
    Faild = unknown
>(
    effect: Effect<Params, Done, Faild>
): IAction<Params, Done, Faild, Effect<Params, Done, Faild>> {
    const scope = defaultScope;
    const slot = scope.createSlot();

    return Object.assign(
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
        }
    );
}

export default createAction;

export interface IUnit {
    slot: Slot;
}
