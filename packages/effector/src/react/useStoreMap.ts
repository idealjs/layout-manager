import { useSyncExternalStore } from "react";

import CommonStore from "../classes/CommonStore";

const useStoreMap = <State, Result>(
    store: CommonStore<State>,
    selector: (store: State) => Result
) => {
    return useSyncExternalStore(store.subscribe, () =>
        selector(store.getState())
    );
};

export default useStoreMap;
