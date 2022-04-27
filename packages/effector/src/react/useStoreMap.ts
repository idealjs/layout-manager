import { useSyncExternalStore } from "react";

import Store from "./Store";

const useStoreMap = <State, Result>(
    store: Store<State>,
    selector: (store: State) => Result
) => {
    return useSyncExternalStore(store.subscribe, () =>
        selector(store.getState())
    );
};

export default useStoreMap;
