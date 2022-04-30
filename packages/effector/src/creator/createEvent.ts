import createUnit, {
    Effect,
    IUnit,
    IUnitOptions,
    UNIT_TYPE,
} from "./createUnit";

export interface IEvent<OutDone>
    extends Omit<
        IUnit<OutDone[], OutDone, never, Effect<OutDone[], OutDone, never>>,
        "on" | "off"
    > {
    (...params: Parameters<Effect<OutDone[], OutDone, never>>): Promise<void>;
}

const createEvent = <Payload = void>(
    unitOptions?: IUnitOptions
): IEvent<Payload> => {
    return createUnit((payload) => payload, {
        type: UNIT_TYPE.EVENT,
        ...unitOptions,
    });
};

export default createEvent;
