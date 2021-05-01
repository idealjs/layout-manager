import { useContext } from "react";
import { FC } from "react";
import { createContext } from "react";

const context = createContext<string | number | null>(null);

const MainLayoutSymbolProvider: FC<{
    mainLayoutSymbol: string | number;
}> = (props) => {
    const { mainLayoutSymbol, children } = props;
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
