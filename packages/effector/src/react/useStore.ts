import { useMemo, useSyncExternalStore } from "react";

import CommonStore from "../classes/CommonStore";
import { useScope } from "./ScopeProvider";

const useStore = <State>(store: CommonStore<State>) => {
    const scope = useScope();
    const scopeStore = useMemo(() => {
        const scopeStore = scope.getStore(store.unit.slot.id);

        if (scopeStore?.subscribe == null || scopeStore.getState == null) {
            throw new Error("");
        }
        return scopeStore;
    }, [scope, store.unit.slot.id]);

    return useSyncExternalStore(scopeStore.subscribe, scopeStore.getState);
};

export default useStore;
