import { Fragment, useContext } from "react";
import { createContext } from "react";
import {
    Layout,
    Provider,
    LayoutNode,
    ILayoutJSON,
} from "@idealjs/layout-manager";
import Portal from "./Portal";
import layoutJSON from "./layout.json";

export const PopoutContext = createContext<string[]>([]);

const ROOT = new LayoutNode({
    layoutJSON: layoutJSON as ILayoutJSON,
});

const Popout = () => {
    const data = useContext(PopoutContext);
    return (
        <Fragment>
            {data.map((d) => {
                return (
                    <Portal key={d}>
                        <Provider factory={() => () => <div>test</div>}>
                            <Layout layoutNode={ROOT} />
                        </Provider>
                    </Portal>
                );
            })}
        </Fragment>
    );
};

export default Popout;
