import { uniqueId } from "lodash";
import { createContext, FC, useContext, useMemo } from "react";

const context = createContext<symbol | null>(null);

const Provider: FC = (props) => {
    const { children } = props;
    const layoutSymbol = useMemo(() => {
        return Symbol(uniqueId());
    }, []);
    return <context.Provider value={layoutSymbol}>{children}</context.Provider>;
};

export default Provider;

export const useLayoutSymbol = () => {
    const symbol = useContext(context);
    if (symbol == null) {
        throw new Error("");
    }
    return symbol;
};
