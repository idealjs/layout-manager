import { FC, PropsWithChildren } from "react";
import {
    createContext,
    Dispatch,
    Fragment,
    SetStateAction,
    useContext,
} from "react";

import Popout from "./Popout";
import { ILayoutProviderProps } from "./Provider";

export interface IPortal {
    id: string | number;
    top?: number;
    left?: number;
    height?: number;
    width?: number;
}

type ContextType = {
    portalsRef: React.MutableRefObject<IPortal[]>;
    portals: IPortal[];
    setPortals: Dispatch<SetStateAction<IPortal[]>>;
} | null;

const PortalsContext = createContext<ContextType>(null);

interface IProps extends Partial<ILayoutProviderProps> {}

const PopoutManager = (props: PropsWithChildren<IProps>) => {
    const { children, ...layoutProviderProps } = props;
    const { portals } = usePortals();
    return (
        <Fragment>
            {portals.map((p) => {
                return (
                    <Popout
                        key={p.id}
                        portalId={p.id}
                        left={p.left}
                        top={p.top}
                        {...layoutProviderProps}
                    >
                        {children}
                    </Popout>
                );
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
