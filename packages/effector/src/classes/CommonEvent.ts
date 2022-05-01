import { UNIT_TYPE } from "../creator/createUnit";
import CommonUnit, { IUnitOptions } from "./CommonUnit";

class CommonEvent<Payload> extends CommonUnit<Payload[], Payload, never> {
    constructor(unitOptions?: Omit<IUnitOptions, "type">) {
        super((payload) => payload, {
            ...unitOptions,
            type: UNIT_TYPE.EVENT,
        });
    }
}

export default CommonEvent;
