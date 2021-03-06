import { Fragment, useContext } from "react";
import { createContext } from "react";
import {
    Layout,
    Provider,
    ROOTID,
    ILayoutNode,
    IPanelNode,
    LAYOUT_DIRECTION,
} from "@idealjs/layout-manager";
import Portal from "./Portal";
export const PopoutContext = createContext<string[]>([]);

const layouts: ILayoutNode[] = [
    {
        id: ROOTID,
        parentId: "",
        children: ["A", "B"],
        direction: LAYOUT_DIRECTION.COL,
        primaryOffset: 0,
        secondaryOffset: 0,
        height: 0,
        width: 0,
        left: 0,
        top: 0,
    },
    {
        id: "A",
        parentId: ROOTID,
        children: ["A_A"],
        direction: LAYOUT_DIRECTION.TAB,
        primaryOffset: 0,
        secondaryOffset: 0,
        height: 0,
        width: 0,
        left: 0,
        top: 0,
    },
    {
        id: "B",
        parentId: ROOTID,
        children: ["B_A", "B_B"],
        direction: LAYOUT_DIRECTION.ROW,
        primaryOffset: 0,
        secondaryOffset: 0,
        height: 0,
        width: 0,
        left: 0,
        top: 0,
    },
    {
        id: "B_A",
        parentId: "B",
        children: ["B_A_B", "B_A_A"],
        direction: LAYOUT_DIRECTION.TAB,
        primaryOffset: 0,
        secondaryOffset: 0,
        height: 0,
        width: 0,
        left: 0,
        top: 0,
    },
    {
        id: "B_B",
        parentId: "B",
        children: ["B_B_B", "B_B_A"],
        direction: LAYOUT_DIRECTION.TAB,
        primaryOffset: 0,
        secondaryOffset: 0,
        height: 0,
        width: 0,
        left: 0,
        top: 0,
    },
];

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
                            layouts={layouts}
                            panels={panels}
                            factory={() => () => <div>test</div>}
                        >
                            <Layout />
                        </Provider>
                    </Portal>
                );
            })}
        </Fragment>
    );
};

export default Popout;
