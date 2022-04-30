import { createContext, PropsWithChildren, useContext } from "react";

import { defaultScope, Scope } from "../creator/createScope";

const context = createContext<Scope>(defaultScope);

interface IProps {
    scope: Scope;
}

const ScopeProvider = (props: PropsWithChildren<IProps>) => {
    const { children, scope } = props;

    return <context.Provider value={scope}>{children}</context.Provider>;
};

export default ScopeProvider;

export const useScope = () => {
    const scope = useContext(context);
    if (!scope) throw new Error("ScopeProvider is not found");
    return scope;
};
