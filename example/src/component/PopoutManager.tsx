import { FC } from "react";
import {
    Fragment,
    SetStateAction,
    useContext,
    createContext,
    Dispatch,
} from "react";
import Popout from "./Popout";

type ContextType = {
    portals: (string | number)[];
    setPortals: Dispatch<SetStateAction<(string | number)[]>>;
} | null;

const PortalsContext = createContext<ContextType>(null);

const PopoutManager = () => {
    const { portals } = usePortals();
    return (
        <Fragment>
            {portals.map((d) => {
                return <Popout key={d} portalId={d} />;
            })}
        </Fragment>
    );
};

export default PopoutManager;

export const PortalsProvider: FC<NonNullable<ContextType>> = (props) => {
    const { children, portals, setPortals } = props;
    return (
        <PortalsContext.Provider value={{ portals, setPortals }}>
            {children}
        </PortalsContext.Provider>
    );
};

export const usePortals = () => {
    const ctx = useContext(PortalsContext);
    if (ctx == null) {
        throw new Error("");
    }
    return ctx;
};
