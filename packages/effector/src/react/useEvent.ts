import { useMemo } from "react";

import CommonEvent from "../classes/CommonEvent";
import CommonScope from "../classes/CommonScope";
import { useScope } from "./ScopeProvider";

const useEvent = <Payload>(
    event: CommonEvent<Payload>,
    _scope?: CommonScope
) => {
    const scope = useScope();
    const scopeEvent = useMemo(() => {
        const scopeEvent = (_scope ?? scope).getUnit(event.slot.id);

        if (!scopeEvent) {
            throw new Error("");
        }
        return Object.assign(scopeEvent.runUnit.bind(scopeEvent), scopeEvent);
    }, [_scope, scope, event.slot.id]);

    return scopeEvent;
};

export default useEvent;
