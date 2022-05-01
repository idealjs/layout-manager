import CommonStore from "../classes/CommonStore";
import { IUnitOptions } from "../classes/CommonUnit";

const createStore = <State>(
    initialState: State,
    unitOptions?: IUnitOptions
) => {
    const commonStore = new CommonStore(initialState, unitOptions);

    const store = Object.assign(commonStore.unit.runUnit, commonStore);

    return store;
};

export default createStore;
