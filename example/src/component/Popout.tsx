import { Fragment, useContext } from "react";
import { createContext } from "react";
import {
    Layout,
    Provider,
    IPanelNode,
    LayoutNode,
    LAYOUT_DIRECTION,
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

const panels: IPanelNode[] = [
    {
        id: "A_A",
        parentId: "N_A",
        page: "test",
        selected: false,
    },
    {
        id: "A_B",
        parentId: "N_A",
        page: "test",
        selected: false,
    },
    {
        id: "B_B_B",
        parentId: "N_B_B",
        page: "test",
        selected: false,
    },
    {
        id: "B_B_A",
        parentId: "N_B_B",
        page: "test",
        selected: false,
    },
    {
        id: "B_A_B",
        parentId: "N_B_A",
        page: "test2",
        selected: false,
    },
    {
        id: "B_A_A",
        parentId: "N_B_A",
        page: "test",
        selected: false,
    },
];

const Popout = () => {
    const data = useContext(PopoutContext);
    return (
        <Fragment>
            {data.map((d) => {
                return (
                    <Portal key={d}>
                        <Provider
                            panels={panels}
                            factory={() => () => <div>test</div>}
                        >
                            <Layout layoutNode={N} />
                        </Provider>
                    </Portal>
                );
            })}
        </Fragment>
    );
};

export default Popout;
