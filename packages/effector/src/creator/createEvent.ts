import createUnit, {
    doneSymbol,
    Effect,
    faildSymbol,
    IUnit,
    startSymbol,
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
        target: IUnit<TParams, TDone, TFaild, TEffect> | IEvent<TDone>,
        eventName: typeof startSymbol,
        listener: () => void
    ): IEvent<OutDone>;

    on<
        TParams extends unknown[],
        TDone,
        TFaild,
        TEffect extends Effect<TParams, TDone, TFaild>
    >(
        target: IUnit<TParams, TDone, TFaild, TEffect> | IEvent<TDone>,
        eventName: typeof doneSymbol,
        listener: (payload: TDone) => void
    ): IEvent<OutDone>;

    on<
        TParams extends unknown[],
        TDone,
        TFaild,
        TEffect extends Effect<TParams, TDone, TFaild>
    >(
        target: IUnit<TParams, TDone, TFaild, TEffect> | IEvent<TDone>,
        eventName: typeof faildSymbol,
        listener: (payload: TFaild) => void
    ): IEvent<OutDone>;

    on<
        TParams extends unknown[],
        TDone,
        TFaild,
        TEffect extends Effect<TParams, TDone, TFaild>
    >(
        target: IUnit<TParams, TDone, TFaild, TEffect> | IEvent<TDone>,
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

    const event: IEvent<Payload> = Object.assign(unit, {
        on,
        off,
    });

    return event;
};

export default createEvent;
