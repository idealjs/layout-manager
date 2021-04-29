import {
    Fragment,
    SetStateAction,
    useContext,
    createContext,
    Dispatch,
} from "react";
import Popout from "./Popout";

export const PortalsContext = createContext<{
    portals: (string | number)[];
    setPortals: Dispatch<SetStateAction<(string | number)[]>>;
} | null>(null);

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

export const usePortals = () => {
    const ctx = useContext(PortalsContext);
    if (ctx == null) {
        throw new Error("");
    }
    return ctx;
};
