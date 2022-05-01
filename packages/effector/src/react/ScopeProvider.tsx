import { createContext, PropsWithChildren, useContext, useMemo } from "react";

import CommonScope, { defaultScope } from "../classes/CommonScope";
import fork from "../fork";

const context = createContext<CommonScope>(defaultScope);

interface IProps {}

const ScopeProvider = (props: PropsWithChildren<IProps>) => {
    const { children } = props;

    const newScope = useMemo(() => {
        const newScope = fork();
        return newScope;
    }, []);

    return <context.Provider value={newScope}>{children}</context.Provider>;
};

export default ScopeProvider;

export const useScope = () => {
    const scope = useContext(context);
    if (!scope) throw new Error("ScopeProvider is not found");
    return scope;
};
