import { nanoid } from "nanoid";
import { createContext, FC, useContext, useState } from "react";

const context = createContext<string | number | null>(null);

const Provider: FC<React.PropsWithChildren<{ uniqueSymbol?: string | number }>> = (props) => {
    const { children, uniqueSymbol } = props;
    const [layoutSymbol] = useState(() =>
        uniqueSymbol ? uniqueSymbol : nanoid()
    );
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
