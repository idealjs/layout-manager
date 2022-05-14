import CommonMachine from "../classes/CommonMachine";
import { IUnitOptions } from "../classes/CommonUnit";

const createMachine = <State>(
    initialState: State,
    unitOptions?: IUnitOptions
) => {
    const commonMachine = new CommonMachine(initialState, unitOptions);

    const machine = Object.assign(commonMachine.unit.runUnit, commonMachine);

    return machine;
};

export default createMachine;
