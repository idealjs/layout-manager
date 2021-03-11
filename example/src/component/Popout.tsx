import { Fragment, useContext } from "react";
import { createContext } from "react";
import {
    Layout,
    Provider,
    IPanelNode,
    LayoutNode,
} from "@idealjs/layout-manager";
import Portal from "./Portal";
export const PopoutContext = createContext<string[]>([]);

const N = new LayoutNode();
const N_A = new LayoutNode();
const N_A_A = new LayoutNode();
const N_B = new LayoutNode();
const N_B_A = new LayoutNode();
const N_B_B = new LayoutNode();

N.append(N_A).append(N_B);
N_A.append(N_A_A);
N_B.append(N_B_A).append(N_B_B);

const panels: IPanelNode[] = [
    {
        id: "A_A",
        parentId: "A",
        page: "test",
        selected: false,
    },
    {
        id: "A_B",
        parentId: "A",
        page: "test",
        selected: false,
    },
    {
        id: "B_B_B",
        parentId: "B_B",
        page: "test",
        selected: false,
    },
    {
        id: "B_B_A",
        parentId: "B_B",
        page: "test",
        selected: false,
    },
    {
        id: "B_A_B",
        parentId: "B_A",
        page: "test2",
        selected: false,
    },
    {
        id: "B_A_A",
        parentId: "B_A",
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
