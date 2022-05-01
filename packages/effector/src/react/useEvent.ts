import { useMemo } from "react";

import CommonEvent from "../classes/CommonEvent";
import { useScope } from "./ScopeProvider";

const useEvent = <Payload>(event: CommonEvent<Payload>) => {
    const scope = useScope();
    const scopeEvent = useMemo(() => {
        const scopeEvent = scope.getUnit(event.slot.id);

        if (!scopeEvent) {
            throw new Error("");
        }
        return Object.assign(scopeEvent.runUnit.bind(scopeEvent), scopeEvent);
    }, [scope, event.slot.id]);

    return scopeEvent;
};

export default useEvent;
