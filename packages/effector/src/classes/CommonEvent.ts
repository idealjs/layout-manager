import { UNIT_TYPE } from "../creator/createUnit";
import CommonUnit, { IUnit, IUnitOptions } from "./CommonUnit";

export interface IEvent<Done> extends IUnit<Done[], Done, never> {}

class CommonEvent<Done>
    extends CommonUnit<[Done], Done, never>
    implements IEvent<Done>
{
    constructor(unitOptions?: Omit<IUnitOptions, "type">) {
        super((payload) => payload, {
            type: UNIT_TYPE.EVENT,
            ...unitOptions,
        });
    }
}

export default CommonEvent;
