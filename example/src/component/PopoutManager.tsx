import {
    Fragment,
    SetStateAction,
    useContext,
    createContext,
    Dispatch,
} from "react";
import {
    Layout,
    Provider,
    LayoutNode,
    ILayoutJSON,
} from "@idealjs/layout-manager";
import Portal from "./Portal";
import layoutJSON from "./layout.json";

export const PopoutContext = createContext<{
    portalState: string[];
    setPortalState: Dispatch<SetStateAction<string[]>>;
} | null>(null);

const ROOT = new LayoutNode({
    layoutJSON: layoutJSON as ILayoutJSON,
});

const PopoutManager = () => {
    const { portalState } = usePopout();

    return (
        <Fragment>
            {portalState.map((d) => {
                return (
                    <Provider key={d} factory={() => () => <div>test</div>}>
                        <Portal id={d}>
                            <Layout layoutNode={ROOT} />
                        </Portal>
                    </Provider>
                );
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
