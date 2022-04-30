import { useSyncExternalStore } from "react";

import { IStore } from "../creator/createStore";

const useStoreMap = <State, Result>(
    store: IStore<State>,
    selector: (store: State) => Result
) => {
    return useSyncExternalStore(store.subscribe, () =>
        selector(store.getState())
    );
};

export default useStoreMap;
