import { useSyncExternalStore } from "react";

import { useScope } from "./ScopeProvider";
import Store from "./Store";

const useStore = <State>(store: Store<State>) => {
    const scope = useScope();
    const localStore = scope.getStore(store);
    return useSyncExternalStore(store.subscribe, store.getState);
};

export default useStore;
