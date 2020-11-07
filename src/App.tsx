import React from "react";

import Layout from "./component/Layout";
import Provider from "./component/Provider";
import { DIRECTION, INode, NODE_TYPE } from "./reducer/nodes";

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
        type: NODE_TYPE.WIDGET_NODE,
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
        type: NODE_TYPE.WIDGET_NODE,
        parentId: "B",
        children: ["B_A_B", "B_A_A"],
    },
    {
        id: "B_B",
        type: NODE_TYPE.WIDGET_NODE,
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
    },
    {
        id: "B_A_A",
        type: NODE_TYPE.PANEL,
        parentId: "B_A",
    },
];

function App() {
    return (
        <div
            className="App"
            style={{ height: 500, width: 500, backgroundColor: "grey" }}
        >
            <Provider value={nodes}>
                <Layout nodeId="root" />
            </Provider>
        </div>
    );
}

export default App;
