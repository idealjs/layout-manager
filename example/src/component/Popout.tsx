import {
    Layout,
    Provider,
    LayoutNode,
    ILayoutJSON,
} from "@idealjs/layout-manager";
import { FC } from "react";
import Portal from "./Portal";
import layoutJSON from "./layout.json";
import { useMemo } from "react";
import CustomTab from "./CustomTab";

const Popout: FC<{ portalId: string | number }> = (props) => {
    const { portalId } = props;

    const ROOT = useMemo(
        () =>
            new LayoutNode({
                layoutJSON: layoutJSON as ILayoutJSON,
            }),
        []
    );
    
    return (
        <Provider
            layoutSymbol={portalId}
            Tab={CustomTab}
            factory={() => () => <div>test</div>}
        >
            <Portal id={portalId}>
                <Layout layoutNode={ROOT} />
            </Portal>
        </Provider>
    );
};

export default Popout;
