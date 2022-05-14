import CommonUnit, { IUnitOptions } from "../classes/CommonUnit";

export const startSymbol = Symbol("start");
export const doneSymbol = Symbol("done");
export const faildSymbol = Symbol("faild");
export const updateSymbol = Symbol("update");

export enum UNIT_TYPE {
    MACHINE = "MACHINE",
    STORE = "STORE",
    EVENT = "EVENT",
    UNIT = "UNIT",
}

export type Effect<Params extends unknown[], Done, Faild> = (
    ...params: Params
) => Done | Promise<Done> | Faild;

function createUnit<
    Params extends unknown[] = unknown[],
    Done = unknown,
    Faild = unknown
>(
    effect: Effect<Params, Done, Faild>,
    unitOptions: IUnitOptions = { type: UNIT_TYPE.UNIT }
) {
    const commonUnit = new CommonUnit(effect, unitOptions);

    const unit = Object.assign(commonUnit.runUnit, commonUnit);

    return unit;
}

export default createUnit;
