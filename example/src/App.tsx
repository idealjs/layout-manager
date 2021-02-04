import React, { useCallback, useEffect, useState } from "react";

import {
    Layout,
    Provider,
    DIRECTION,
    INode,
    NODE_TYPE,
    CMPTFactory,
    useAddNodeByRules,
    ADD_RULE,
    ROOTID,
} from "@idealjs/layout-manager";
import CustomTab from "./component/CustomTab";

// const nodes: INode[] = [
//     {
//         id: rootid,
//         type: NODE_TYPE.LAYOUT_NODE,
//         parentId: "",
//         direction: DIRECTION.COLUMN,
//         children: ["A", "B"],
//     },
//     {
//         id: "A",
//         type: NODE_TYPE.LAYOUT_NODE,
//         direction: DIRECTION.TAB,
//         parentId: rootid,
//         children: ["A_A", "A_B"],
//     },
//     {
//         id: "A_A",
//         type: NODE_TYPE.PANEL,
//         parentId: "A",
//     },
//     {
//         id: "A_B",
//         type: NODE_TYPE.PANEL,
//         parentId: "A",
//     },
//     {
//         id: "B",
//         type: NODE_TYPE.LAYOUT_NODE,
//         parentId: rootid,
//         children: ["B_A", "B_B"],
//         direction: DIRECTION.ROW,
//     },
//     {
//         id: "B_A",
//         type: NODE_TYPE.LAYOUT_NODE,
//         direction: DIRECTION.TAB,
//         parentId: "B",
//         children: ["B_A_B", "B_A_A"],
//     },
//     {
//         id: "B_B",
//         type: NODE_TYPE.LAYOUT_NODE,
//         direction: DIRECTION.TAB,
//         parentId: "B",
//         children: ["B_B_B", "B_B_A"],
//     },
//     {
//         id: "B_B_B",
//         type: NODE_TYPE.PANEL,
//         parentId: "B_B",
//     },
//     {
//         id: "B_B_A",
//         type: NODE_TYPE.PANEL,
//         parentId: "B_B",
//     },
//     {
//         id: "B_A_B",
//         type: NODE_TYPE.PANEL,
//         parentId: "B_A",
//         page: "test2",
//     },
//     {
//         id: "B_A_A",
//         type: NODE_TYPE.PANEL,
//         parentId: "B_A",
//         page: "test",
//     },
// ];

const nodes: INode[] = [
    {
        id: ROOTID,
        type: NODE_TYPE.LAYOUT_NODE,
        parentId: "",
        direction: DIRECTION.COLUMN,
        children: ["A"],
    },
    {
        id: "A",
        type: NODE_TYPE.LAYOUT_NODE,
        direction: DIRECTION.TAB,
        parentId: ROOTID,
        children: ["A_A"],
    },
    {
        id: "A_A",
        type: NODE_TYPE.PANEL,
        page: "test2",
        parentId: "A",
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
                        console.log(error);
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
    return (
        <div
            className="App"
            style={{ height: 500, width: 500, backgroundColor: "grey" }}
        >
            <Provider value={nodes} factory={factory} Tab={CustomTab}>
                <Layout nodeId={ROOTID} />
            </Provider>
        </div>
    );
}

export default App;
