import { IStore } from "./createStore";
import createUnit, {
    doneSymbol,
    Effect,
    faildSymbol,
    IUnit,
    IUnitOptions,
    startSymbol,
    UNIT_TYPE,
} from "./createUnit";

export interface IEvent<OutDone>
    extends IUnit<
        OutDone[],
        OutDone,
        never,
        Effect<OutDone[], OutDone, never>
    > {
    on<
        TParams extends unknown[],
        TDone,
        TFaild,
        TEffect extends Effect<TParams, TDone, TFaild>
    >(
        target:
            | IUnit<TParams, TDone, TFaild, TEffect>
            | IEvent<TDone>
            | IStore<TDone>,
        eventName: typeof startSymbol,
        listener: () => void
    ): IEvent<OutDone>;

    on<
        TParams extends unknown[],
        TDone,
        TFaild,
        TEffect extends Effect<TParams, TDone, TFaild>
    >(
        target:
            | IUnit<TParams, TDone, TFaild, TEffect>
            | IEvent<TDone>
            | IStore<TDone>,
        eventName: typeof doneSymbol,
        listener: (payload: TDone) => void
    ): IEvent<OutDone>;

    on<
        TParams extends unknown[],
        TDone,
        TFaild,
        TEffect extends Effect<TParams, TDone, TFaild>
    >(
        target:
            | IUnit<TParams, TDone, TFaild, TEffect>
            | IEvent<TDone>
            | IStore<TDone>,
        eventName: typeof faildSymbol,
        listener: (payload: TFaild) => void
    ): IEvent<OutDone>;

    on<
        TParams extends unknown[],
        TDone,
        TFaild,
        TEffect extends Effect<TParams, TDone, TFaild>
    >(
        target:
            | IUnit<TParams, TDone, TFaild, TEffect>
            | IEvent<TDone>
            | IStore<TDone>,
        listener: (payload: TDone) => void
    ): IEvent<OutDone>;

    off<
        TParams extends unknown[],
        TDone,
        TFaild,
        TEffect extends Effect<TParams, TDone, TFaild>
    >(
        target: IUnit<TParams, TDone, TFaild, TEffect>
    ): IEvent<OutDone>;
}

const createInternalEvent = <Payload = void>(
    unitOptions?: IUnitOptions
): IEvent<Payload> => {
    return createUnit((payload) => payload, {
        type: UNIT_TYPE.EVENT,
        ...unitOptions,
    });
};

export default createInternalEvent;
