import { Fragment, useContext } from "react";
import { createContext } from "react";
import {
    Layout,
    Provider,
    LayoutNode,
    LAYOUT_DIRECTION,
    PanelNode,
} from "@idealjs/layout-manager";
import Portal from "./Portal";
export const PopoutContext = createContext<string[]>([]);

const N = new LayoutNode();
N.direction = LAYOUT_DIRECTION.COL;

const N_A = new LayoutNode();
N_A.direction = LAYOUT_DIRECTION.TAB;
N_A.id = "N_A";

const N_B = new LayoutNode();
N_B.direction = LAYOUT_DIRECTION.ROW;

const N_B_A = new LayoutNode();
N_B_A.direction = LAYOUT_DIRECTION.TAB;
N_B_A.id = "N_B_A";

const N_B_B = new LayoutNode();
N_B_B.direction = LAYOUT_DIRECTION.TAB;
N_B_B.id = "N_B_B";

N.append(N_A).append(N_B);
N_B.append(N_B_A).append(N_B_B);

const P_A_A = new PanelNode();
const P_A_B = new PanelNode();
N_A.appendPanelNode(P_A_A, P_A_B);
const P_B_A_A = new PanelNode();
const P_B_A_B = new PanelNode();
N_B_A.appendPanelNode(P_B_A_A, P_B_A_B);
const P_B_B_A = new PanelNode();
const P_B_B_B = new PanelNode();
N_B_B.appendPanelNode(P_B_B_A, P_B_B_B);

const Popout = () => {
    const data = useContext(PopoutContext);
    return (
        <Fragment>
            {data.map((d) => {
                return (
                    <Portal key={d}>
                        <Provider factory={() => () => <div>test</div>}>
                            <Layout layoutNode={N} />
                        </Provider>
                    </Portal>
                );
            })}
        </Fragment>
    );
};

export default Popout;
