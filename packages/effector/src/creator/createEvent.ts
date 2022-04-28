import createUnit, {
    doneSymbol,
    Effect,
    faildSymbol,
    IUnit,
    startSymbol,
} from "./createUnit";

export interface IEvent<OutDone, OutFaild>
    extends IUnit<
        OutDone[],
        OutDone,
        OutFaild,
        Effect<OutDone[], OutDone, OutFaild>
    > {
    on<
        TParams extends unknown[],
        TDone,
        TFaild,
        TEffect extends Effect<TParams, TDone, TFaild>
    >(
        target: IUnit<TParams, TDone, TFaild, TEffect> | IEvent<TDone, TFaild>,
        eventName: typeof startSymbol,
        listener: () => void
    ): IEvent<OutDone, OutFaild>;

    on<
        TParams extends unknown[],
        TDone,
        TFaild,
        TEffect extends Effect<TParams, TDone, TFaild>
    >(
        target: IUnit<TParams, TDone, TFaild, TEffect> | IEvent<TDone, TFaild>,
        eventName: typeof doneSymbol,
        listener: (payload: TDone) => void
    ): IEvent<OutDone, OutFaild>;

    on<
        TParams extends unknown[],
        TDone,
        TFaild,
        TEffect extends Effect<TParams, TDone, TFaild>
    >(
        target: IUnit<TParams, TDone, TFaild, TEffect> | IEvent<TDone, TFaild>,
        eventName: typeof faildSymbol,
        listener: (payload: TFaild) => void
    ): IEvent<OutDone, OutFaild>;

    on<
        TParams extends unknown[],
        TDone,
        TFaild,
        TEffect extends Effect<TParams, TDone, TFaild>
    >(
        target: IUnit<TParams, TDone, TFaild, TEffect> | IEvent<TDone, TFaild>,
        listener: (payload: TDone) => void
    ): IEvent<OutDone, OutFaild>;

    off<
        TParams extends unknown[],
        TDone,
        TFaild,
        TEffect extends Effect<TParams, TDone, TFaild>
    >(
        target: IUnit<TParams, TDone, TFaild, TEffect>
    ): IEvent<OutDone, OutFaild>;
}

const createEvent = <Payload = void>() => {
    const unit = createUnit((payload) => payload);

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
        unit.on(target, listenerOrEvent, listener);
        return event;
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

        return event;
    };

    const event: IEvent<Payload, void> = Object.assign(unit, {
        on,
        off,
    });

    return event;
};

export default createEvent;
