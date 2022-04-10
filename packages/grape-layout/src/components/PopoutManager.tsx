import { ILayoutProviderProps } from "@idealjs/layout-manager";
import { FC } from "react";
import {
    createContext,
    Dispatch,
    Fragment,
    SetStateAction,
    useContext,
} from "react";

import Popout from "./Popout";

type ContextType = {
    portalsRef: React.MutableRefObject<(string | number)[]>;
    portals: (string | number)[];
    setPortals: Dispatch<SetStateAction<(string | number)[]>>;
} | null;

const PortalsContext = createContext<ContextType>(null);

interface IProps extends Partial<ILayoutProviderProps> {}

const PopoutManager = (props: IProps) => {
    const { ...layoutProviderProps } = props;
    const { portals } = usePortals();
    return (
        <Fragment>
            {portals.map((d) => {
                return <Popout key={d} portalId={d} {...layoutProviderProps} />;
            })}
        </Fragment>
    );
};

export default PopoutManager;

export const PortalsProvider: FC<
    React.PropsWithChildren<NonNullable<ContextType>>
> = (props) => {
    const { children, portalsRef, portals, setPortals } = props;
    return (
        <PortalsContext.Provider value={{ portalsRef, portals, setPortals }}>
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
