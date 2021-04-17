import { uniqueId } from "lodash";
import { createContext, FC, useContext, useMemo } from "react";

const context = createContext<symbol | null>(null);

const Provider: FC<{ uniqueSymbol?: symbol }> = (props) => {
    const { uniqueSymbol, children } = props;
    const layoutSymbol = useMemo(() => {
        return uniqueSymbol != null ? uniqueSymbol : Symbol(uniqueId());
    }, [uniqueSymbol]);
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
