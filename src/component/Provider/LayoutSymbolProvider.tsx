import { uniqueId } from "lodash";
import { createContext, FC, useContext, useMemo } from "react";

const context = createContext<symbol>(Symbol(uniqueId()));

const Provider: FC = (props) => {
    const { children } = props;
    const layoutSymbol = useMemo(() => {
        return Symbol(uniqueId());
    }, []);
    return <context.Provider value={layoutSymbol}>{children}</context.Provider>;
};

export default Provider;

export const useLayoutSymbol = () => {
    return useContext(context);
};
