import { useMemo, useSyncExternalStore } from "react";

import { IStore } from "../creator/createStore";
import { useScope } from "./ScopeProvider";

const useStore = <State>(store: IStore<State>) => {
    const scope = useScope();
    const scopeStore = useMemo(() => {
        const scopeStore = scope.getUnit(store.slot.id) as any as
            | IStore<State>
            | undefined;

        if (scopeStore?.subscribe == null || scopeStore.getState == null) {
            throw new Error("");
        }
        return scopeStore;
    }, [scope, store.slot.id]);

    return useSyncExternalStore(scopeStore.subscribe, scopeStore.getState);
};

export default useStore;
