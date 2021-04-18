import {
    Fragment,
    SetStateAction,
    useContext,
    createContext,
    Dispatch,
} from "react";
import Popout from "./Popout";

export const PopoutContext = createContext<{
    portalState: string[];
    setPortalState: Dispatch<SetStateAction<string[]>>;
} | null>(null);

const PopoutManager = () => {
    const { portalState } = usePopout();

    return (
        <Fragment>
            {portalState.map((d) => {
                return <Popout portalId={d} />;
            })}
        </Fragment>
    );
};

export default PopoutManager;

export const usePopout = () => {
    const ctx = useContext(PopoutContext);
    if (ctx == null) {
        throw new Error("");
    }
    return ctx;
};
