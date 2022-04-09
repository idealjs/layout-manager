import { useContext } from "react";
import { FC } from "react";
import { createContext } from "react";

const context = createContext<string | number | null>(null);

const MainLayoutSymbolProvider: FC<React.PropsWithChildren<{
    mainLayoutSymbol: string | number;
}>> = (props) => {
    const { children, mainLayoutSymbol } = props;
    return (
        <context.Provider value={mainLayoutSymbol}>{children}</context.Provider>
    );
};

export default MainLayoutSymbolProvider;

export const useMainLayoutSymbol = () => {
    const ctx = useContext(context);
    if (ctx == null) {
        throw new Error("null mainLayoutSymbol");
    }
    return ctx;
};
