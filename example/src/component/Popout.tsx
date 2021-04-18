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

const Popout: FC<{ portalId: string }> = (props) => {
    const { portalId } = props;

    const ROOT = useMemo(
        () =>
            new LayoutNode({
                layoutJSON: layoutJSON as ILayoutJSON,
            }),
        []
    );
    return (
        <Provider factory={() => () => <div>test</div>}>
            <Portal id={portalId}>
                <Layout layoutNode={ROOT} />
            </Portal>
        </Provider>
    );
};

export default Popout;
