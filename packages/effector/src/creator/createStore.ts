import { defaultScope } from "./createScope";
import Store from "./Store";

const createStore = <State>(initialState: State) => {
    return new Store(initialState, defaultScope);
};

export default createStore;
