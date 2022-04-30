import { IEvent } from "./createEvent";
import createInternalEvent, { IInternalEvent } from "./createInternalEvent";
import { Effect, IUnit, UNIT_TYPE, updateSymbol } from "./createUnit";

interface ISubscribeListener<State> {
    (state: State): void;
}

interface IUnSubscribe {
    (): void;
}

export interface IStore<State>
    extends Omit<
        IUnit<State[], State, never, Effect<State[], State, never>>,
        "on" | "off"
    > {
    on<
        TParams extends unknown[],
        TDone,
        TFaild,
        TEffect extends Effect<TParams, TDone, TFaild>
    >(
        target:
            | IUnit<TParams, TDone, TFaild, TEffect>
            | IInternalEvent<TDone>
            | IEvent<TDone>
            | IStore<TDone>,
        listener: (state: State, payload: TDone | TFaild) => State
    ): IStore<State>;

    off<
        TParams extends unknown[],
        TDone,
        TFaild,
        TEffect extends Effect<TParams, TDone, TFaild>
    >(
        target:
            | IUnit<TParams, TDone, TFaild, TEffect>
            | IEvent<TDone>
            | IStore<TDone>
    ): IStore<State>;

    getState(): State;
    subscribe(listener: ISubscribeListener<State>): IUnSubscribe;
}

const createStore = <State>(initialState: State) => {
    let state = initialState;

    const unit = createInternalEvent<State>({
        type: UNIT_TYPE.STORE,
    });
    const originOn = unit.on;
    const originOff = unit.off;

    const on = <
        TParams extends TDone[],
        TDone,
        TFaild,
        TEffect extends Effect<TParams, TDone, TFaild>
    >(
        target:
            | IUnit<TParams, TDone, TFaild, TEffect>
            | IEvent<TDone>
            | IStore<TDone>,
        listener: (state: State, payload?: TDone | TFaild) => State
    ) => {
        originOn(target, (payload) => {
            state = listener(state, payload);
            unit(state);
        });

        return store;
    };

    const off = <
        TParams extends unknown[],
        TDone,
        TFaild,
        TEffect extends Effect<TParams, TDone, TFaild>
    >(
        target: IUnit<TParams, TDone, TFaild, TEffect>
    ) => {
        originOff(target);
        return store;
    };

    const getState = (): State => {
        return state;
    };

    const subscribe = (listener: ISubscribeListener<State>): IUnSubscribe => {
        unit.slot.addListener(updateSymbol, listener);
        return () => {
            unit.slot.removeListener(updateSymbol, listener);
        };
    };

    const store: IStore<State> = Object.assign(unit, {
        on,
        off,
        getState,
        subscribe,
    });

    return store;
};

export default createStore;
