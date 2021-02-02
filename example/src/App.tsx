import React, { useEffect, useState } from "react";

import {
    Layout,
    Provider,
    DIRECTION,
    INode,
    NODE_TYPE,
    CMPTFactory,
} from "@idealjs/layout-manager";
import CustomTab from "./component/CustomTab";

const nodes: INode[] = [
    {
        id: "root",
        type: NODE_TYPE.LAYOUT_NODE,
        parentId: "",
        direction: DIRECTION.COLUMN,
        children: ["A", "B"],
    },
    {
        id: "A",
        type: NODE_TYPE.LAYOUT_NODE,
        direction: DIRECTION.TAB,
        parentId: "root",
        children: ["A_A", "A_B"],
    },
    {
        id: "A_A",
        type: NODE_TYPE.PANEL,
        parentId: "A",
    },
    {
        id: "A_B",
        type: NODE_TYPE.PANEL,
        parentId: "A",
    },
    {
        id: "B",
        type: NODE_TYPE.LAYOUT_NODE,
        parentId: "root",
        children: ["B_A", "B_B"],
        direction: DIRECTION.ROW,
    },
    {
        id: "B_A",
        type: NODE_TYPE.LAYOUT_NODE,
        direction: DIRECTION.TAB,
        parentId: "B",
        children: ["B_A_B", "B_A_A"],
    },
    {
        id: "B_B",
        type: NODE_TYPE.LAYOUT_NODE,
        direction: DIRECTION.TAB,
        parentId: "B",
        children: ["B_B_B", "B_B_A"],
    },
    {
        id: "B_B_B",
        type: NODE_TYPE.PANEL,
        parentId: "B_B",
    },
    {
        id: "B_B_A",
        type: NODE_TYPE.PANEL,
        parentId: "B_B",
    },
    {
        id: "B_A_B",
        type: NODE_TYPE.PANEL,
        parentId: "B_A",
        page: "test2",
    },
    {
        id: "B_A_A",
        type: NODE_TYPE.PANEL,
        parentId: "B_A",
        page: "test",
    },
];

const factory: CMPTFactory = (page: string) => {
    switch (page) {
        case "test":
            return () => {
                const [counter, setCounter] = useState(0);
                useEffect(() => {
                    const handler = setInterval(() => {
                        setCounter((c) => c + 1);
                    }, 1000);
                    return () => {
                        clearInterval(handler);
                    };
                }, []);
                return <div>{counter}</div>;
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
                <Layout nodeId="root" />
            </Provider>
        </div>
    );
}

export default App;
