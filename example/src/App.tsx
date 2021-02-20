import React, { useCallback, useEffect, useState } from "react";

import {
    Layout,
    Provider,
    CMPTFactory,
    useAddNodeByRules,
    ADD_RULE,
    ROOTID,
    ILayoutNode,
    IPanelNode,
    LAYOUT_DIRECTION,
} from "@idealjs/layout-manager";
import CustomTab from "./component/CustomTab";
import Popout, { PopoutContext } from "./component/Popout";
import { Fragment } from "react";

// const nodes: INode[] = [
//     {
//         id: ROOTID,
//         type: NODE_TYPE.LAYOUT_NODE,
//         parentId: "",
//         direction: LAYOUT_DIRECTION.COLUMN,
//         children: ["A"],
//     },
//     {
//         id: "A",
//         type: NODE_TYPE.LAYOUT_NODE,
//         direction: LAYOUT_DIRECTION.TAB,
//         parentId: ROOTID,
//         children: ["A_A"],
//     },
//     {
//         id: "A_A",
//         type: NODE_TYPE.PANEL,
//         page: "test2",
//         parentId: "A",
//     },
// ];

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

const factory: CMPTFactory = (page: string) => {
    switch (page) {
        case "test":
            return (props) => {
                const { nodeData } = props;
                const [counter, setCounter] = useState(0);
                const [radom] = useState(Math.random());
                useEffect(() => {
                    const handler = setInterval(() => {
                        setCounter((c) => c + 1);
                    }, 1000);
                    return () => {
                        clearInterval(handler);
                    };
                }, []);
                return (
                    <div>
                        {nodeData}:{counter}---{radom}
                    </div>
                );
            };
        case "test2":
            return (props) => {
                const { nodeData } = props;
                const [counter, setCounter] = useState(0);
                useEffect(() => {
                    const handler = setInterval(() => {
                        setCounter((c) => c + 1);
                    }, 1000);
                    return () => {
                        clearInterval(handler);
                    };
                }, []);
                const addNodeByRules = useAddNodeByRules();
                const onClick = useCallback(async () => {
                    try {
                        await addNodeByRules(
                            "test",
                            [
                                { addRule: ADD_RULE.RIGHT, limit: 3 },
                                { addRule: ADD_RULE.BOTTOM, limit: 3 },
                                { addRule: ADD_RULE.TAB, limit: 3 },
                            ],
                            10,
                            Math.random()
                        );
                    } catch (error) {
                        console.error(error);
                    }
                }, [addNodeByRules]);
                return (
                    <div>
                        <button onClick={onClick}>test</button>
                        {nodeData}
                        {counter}
                    </div>
                );
            };
        default:
            return () => {
                return <div>page {page} not found</div>;
            };
    }
};

function App() {
    const [portalState, setPortalState] = useState<string[]>([]);
    const onClick = useCallback(() => {
        setPortalState((s) => s.concat("b"));
    }, []);

    return (
        <Fragment>
            <div className="App" style={{ height: 500, width: 500 }}>
                <button onClick={onClick}>open portal</button>
                <Provider
                    layouts={layouts}
                    panels={panels}
                    factory={factory}
                    Tab={CustomTab}
                >
                    <Layout />
                </Provider>
            </div>
            <PopoutContext.Provider value={portalState}>
                <Popout />
            </PopoutContext.Provider>
        </Fragment>
    );
}

export default App;
