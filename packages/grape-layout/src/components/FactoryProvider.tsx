import { CMPTFactory } from "@idealjs/layout-manager";
import { createContext, FC, useContext } from "react";

const context = createContext<CMPTFactory | null>(null);

const FactoryProvider: FC<{ factory: CMPTFactory }> = (props) => {
    const { children, factory } = props;
    return <context.Provider value={factory}>{children}</context.Provider>;
};

export const useFactory = () => {
    const ctx = useContext(context);
    if (ctx == null) {
        throw new Error("");
    }
    return ctx;
};

export default FactoryProvider;
