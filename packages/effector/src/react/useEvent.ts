import { useMemo } from "react";

import { IEvent } from "../creator/createEvent";
import { useScope } from "./ScopeProvider";

const useEvent = <Payload>(event: IEvent<Payload>) => {
    const scope = useScope();
    const scopeEvent = useMemo(() => {
        const scopeEvent = scope.getUnit(event.slot.id) as any as
            | IEvent<Payload>
            | undefined;

        if (!scopeEvent) {
            throw new Error("");
        }
        return scopeEvent;
    }, [scope, event.slot.id]);

    return scopeEvent;
};

export default useEvent;
