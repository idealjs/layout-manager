import { Slot } from "@idealjs/sns";

import createNode from "../graph/createNode";
import createAction, {
    doneSymbol,
    Effect,
    faildSymbol,
    IAction,
    IUnit,
    startSymbol,
    updateSymbol,
} from "./createAction";
import { defaultScope } from "./createScope";

export interface IEvent<OutParams extends unknown[], OutDone, OutFaild>
    extends IAction<
        OutParams,
        OutDone,
        OutFaild,
        Effect<OutParams, OutDone, OutFaild>
    > {
    on<
        Params extends unknown[],
        Done,
        Faild,
        E extends Effect<Params, Done, Faild>
    >(
        unit: IAction<Params, Done, Faild, E>,
        eventName: typeof startSymbol,
        listener: () => void
    ): IEvent<OutParams, OutDone, OutFaild>;

    on<
        Params extends unknown[],
        Done,
        Faild,
        E extends Effect<Params, Done, Faild>
    >(
        unit: IAction<Params, Done, Faild, E>,
        eventName: typeof doneSymbol,
        listener: (payload: Done) => void
    ): IEvent<OutParams, OutDone, OutFaild>;

    on<
        Params extends unknown[],
        Done,
        Faild,
        E extends Effect<Params, Done, Faild>
    >(
        unit: IAction<Params, Done, Faild, E>,
        eventName: typeof faildSymbol,
        listener: (payload: Faild) => void
    ): IEvent<OutParams, OutDone, OutFaild>;

    on<Done, Faild>(
        unit: IEvent<[Done], Done, Faild>,
        eventName: typeof startSymbol,
        listener: () => void
    ): IEvent<OutParams, OutDone, OutFaild>;

    on<Done, Faild>(
        unit: IEvent<[Done], Done, Faild>,
        eventName: typeof doneSymbol,
        listener: (payload: Done) => void
    ): IEvent<OutParams, OutDone, OutFaild>;

    on<Done, Faild>(
        unit: IEvent<[Done], Done, Faild>,
        eventName: typeof faildSymbol,
        listener: (payload: Done) => void
    ): IEvent<OutParams, OutDone, OutFaild>;

    on<Done, Faild>(
        unit: IEvent<[Done], Done, Faild>,
        listener: (payload: Done) => void
    ): IEvent<OutParams, OutDone, OutFaild>;

    off: (unit: { slot: Slot }) => IEvent<OutParams, OutDone, OutFaild>;
}

const createEvent = <Payload = void>(): IEvent<[Payload], Payload, void> => {
    const scope = defaultScope;
    const slot = scope.createSlot();
    const listeners: WeakMap<Slot, (...args: any[]) => void> = new WeakMap();

    const on = <
        Params extends unknown[],
        Done,
        Faild,
        E extends Effect<Params, Done, Faild>
    >(
        unit: IAction<Params, Done, Faild, E>,
        listenerOrEvent: ((payload: ReturnType<E>) => void) | (string | symbol),
        listener?: (payload: ReturnType<E>) => void
    ) => {
        if (typeof listenerOrEvent === "function") {
            unit.slot.addListener(updateSymbol, listenerOrEvent);
            listeners.set(slot, listenerOrEvent);
            scope.graph.addEdge(event, createNode(event, listenerOrEvent));
        } else if (listener) {
            unit.slot.addListener(listenerOrEvent, listener);
            listeners.set(slot, listener);
            scope.graph.addEdge(event, createNode(event, listener));
        } else {
            throw new Error("listener is required");
        }

        return event;
    };

    const off = (unit: IUnit) => {
        const _listener = listeners.get(unit.slot);
        if (_listener) {
            unit.slot.removeListener(updateSymbol, _listener);
            listeners.delete(unit.slot);
            scope.graph.removeEdge(event, unit);
        }
        return event;
    };

    const action = createAction((payload) => payload);
    const event = Object.assign(action, {
        on,
        off,
    });
    return event;
};

export default createEvent;
