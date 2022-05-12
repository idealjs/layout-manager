import CommonEvent from "../classes/CommonEvent";
import CommonUnit, { IUnitOptions } from "../classes/CommonUnit";
import { Effect } from "./createUnit";

export interface IEvent<OutDone>
    extends Omit<CommonUnit<OutDone[], OutDone, never>, "on" | "off"> {
    (...params: Parameters<Effect<OutDone[], OutDone, never>>): Promise<void>;
}

const createEvent = <Payload = void>(
    unitOptions?: Omit<IUnitOptions, "type">
): IEvent<Payload> => {
    const commonEvent = new CommonEvent<Payload>(unitOptions);

    return Object.assign(commonEvent.runUnit, commonEvent);
};

export default createEvent;
