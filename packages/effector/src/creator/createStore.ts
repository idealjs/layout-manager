import createEvent, { IEvent } from "./createEvent";
import { Effect, IUnit, updateSymbol } from "./createUnit";

interface ISubscribeListener<State> {
    (state: State): void;
}

interface IUnSubscribe {
    (): void;
}

export interface IStore<State> {
    on<
        TParams extends unknown[],
        TDone,
        TFaild,
        TEffect extends Effect<TParams, TDone, TFaild>
    >(
        target: IUnit<TParams, TDone, TFaild, TEffect> | IEvent<TDone, TFaild>,
        listener: (state: State, payload?: TDone | TFaild) => State
    ): IStore<State>;

    off<
        TParams extends unknown[],
        TDone,
        TFaild,
        TEffect extends Effect<TParams, TDone, TFaild>
    >(
        target: IUnit<TParams, TDone, TFaild, TEffect>
    ): IStore<State>;

    getState(): State;
    subscribe(listener: ISubscribeListener<State>): IUnSubscribe;
}

const createStore = <State>(initialState: State) => {
    let state = initialState;

    const unit = createEvent<State>();

    const on = <
        TParams extends TDone[],
        TDone,
        TFaild,
        TEffect extends Effect<TParams, TDone, TFaild>
    >(
        target: IUnit<TParams, TDone, TFaild, TEffect> | IEvent<TDone, TFaild>,
        listener: (state: State, payload?: TDone | TFaild) => State
    ) => {
        unit.on(target, (payload) => {
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
        unit.off(target);
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
