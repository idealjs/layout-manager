import { UNIT_TYPE, updateSymbol } from "../creator/createUnit";
import CommonEvent from "./CommonEvent";
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

    constructor(
        initialState: State,
        unitOptions: Omit<IUnitOptions, "type"> = {}
    ) {
        this.state = initialState;
        this.unitOptions = unitOptions;
        this.unit = new CommonUnit<State[], State, never>((p) => p, {
            ...unitOptions,
            type: UNIT_TYPE.STORE,
        });
        this.unit.scope.setStore(this.unit.slot.id, this);

        this.on = this.on.bind(this);
        this.off = this.off.bind(this);
        this.getState = this.getState.bind(this);
        this.subscribe = this.subscribe.bind(this);
        this.fork = this.fork.bind(this);
    }

    public on<TParams extends unknown[], TDone, TFaild>(
        target:
            | CommonUnit<TParams, TDone, TFaild>
            | CommonEvent<TDone>
            | CommonStore<TDone>,
        listener: (
            this: CommonStore<State>,
            state: State,
            payload: TDone | TFaild
        ) => State
    ) {
        this.unit.on(target, (payload) => {
            this.state = listener.call(this, this.state, payload);
            this.unit.runUnit.bind(this)(this.state);
        });

        return this;
    }

    public off<TParams extends unknown[], TDone, TFaild>(
        target: CommonUnit<TParams, TDone, TFaild>
    ) {
        this.unit.off(target);

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
        });
    }
}

export default CommonStore;
