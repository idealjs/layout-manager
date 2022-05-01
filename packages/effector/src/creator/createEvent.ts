import CommonEvent from "../classes/CommonEvent";
import { IUnitOptions } from "../classes/CommonUnit";

const createEvent = <Payload = void>(
    unitOptions?: Omit<IUnitOptions, "type">
) => {
    const commonEvent = new CommonEvent<Payload>(unitOptions);

    return Object.assign(commonEvent.runUnit, commonEvent);
};

export default createEvent;
