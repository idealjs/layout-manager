import { IEvent } from "./createEvent";
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

export interface IInternalEvent<OutDone>
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
            | IInternalEvent<TDone>
            | IEvent<TDone>
            | IStore<TDone>,
        eventName: typeof startSymbol,
        listener: () => void
    ): IInternalEvent<OutDone>;

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
        eventName: typeof doneSymbol,
        listener: (payload: TDone) => void
    ): IInternalEvent<OutDone>;

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
        eventName: typeof faildSymbol,
        listener: (payload: TFaild) => void
    ): IInternalEvent<OutDone>;

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
        listener: (payload: TDone) => void
    ): IInternalEvent<OutDone>;

    off<
        TParams extends unknown[],
        TDone,
        TFaild,
        TEffect extends Effect<TParams, TDone, TFaild>
    >(
        target: IUnit<TParams, TDone, TFaild, TEffect>
    ): IInternalEvent<OutDone>;
}

const createInternalEvent = <Payload = void>(
    unitOptions?: IUnitOptions
): IInternalEvent<Payload> => {
    return createUnit((payload) => payload, {
        type: UNIT_TYPE.EVENT,
        ...unitOptions,
    });
};

export default createInternalEvent;
