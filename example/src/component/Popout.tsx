import { Fragment, useContext } from "react";
import { createContext } from "react";
import {
    Layout,
    Provider,
    LayoutNode,
    LAYOUT_DIRECTION,
    PanelNode,
    ROOTID,
} from "@idealjs/layout-manager";
import Portal from "./Portal";
export const PopoutContext = createContext<string[]>([]);

const ROOT = new LayoutNode({
    layoutJSON: {
        direction: LAYOUT_DIRECTION.ROOT,
    },
});
ROOT.id = ROOTID;

const N = new LayoutNode({
    layoutJSON: {
        direction: LAYOUT_DIRECTION.COL,
    },
});
N.id = "mainN";

const N_A = new LayoutNode({ layoutJSON: { direction: LAYOUT_DIRECTION.TAB } });
N_A.id = "N_A";

const N_B = new LayoutNode({ layoutJSON: { direction: LAYOUT_DIRECTION.ROW } });
N_B.id = "N_B";

const N_B_A = new LayoutNode({
    layoutJSON: { direction: LAYOUT_DIRECTION.TAB },
});
N_B_A.id = "N_B_A";

const N_B_B = new LayoutNode({
    layoutJSON: {
        direction: LAYOUT_DIRECTION.TAB,
    },
});
N_B_B.id = "N_B_B";

ROOT.appendLayoutNode(N);

N.appendLayoutNode(N_A).appendLayoutNode(N_B);
N_B.appendLayoutNode(N_B_A).appendLayoutNode(N_B_B);

const P_A_A = new PanelNode({
    panelJSON: {
        id: "P_A_A",
        page: "test2",
    },
});

const P_A_B = new PanelNode({
    panelJSON: {
        id: "P_A_B",
        page: "test",
    },
});

N_A.appendPanelNode(P_A_A, P_A_B);

const P_B_A_A = new PanelNode({
    panelJSON: {
        id: "P_B_A_A",
        page: "test",
    },
});

const P_B_A_B = new PanelNode({
    panelJSON: {
        id: "P_B_A_B",
        page: "test",
        data: "abc",
    },
});

N_B_A.appendPanelNode(P_B_A_A, P_B_A_B);

const P_B_B_A = new PanelNode({
    panelJSON: {
        id: "P_B_B_A",
        page: "test",
    },
});

const P_B_B_B = new PanelNode({
    panelJSON: {
        id: "P_B_B_B",
        page: "test",
    },
});

N_B_B.appendPanelNode(P_B_B_A, P_B_B_B);

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
