import { UNIT_TYPE } from "../creator/createUnit";
import CommonUnit, { IUnit, IUnitOptions } from "./CommonUnit";

export interface IEvent<Done> extends IUnit<Done[], Done, never> {}

class CommonEvent<Done>
    extends CommonUnit<Done[], Done, never>
    implements IEvent<Done>
{
    constructor(unitOptions?: Omit<IUnitOptions, "type">) {
        super((payload) => payload, {
            ...unitOptions,
            type: UNIT_TYPE.EVENT,
        });
    }
}

export default CommonEvent;
