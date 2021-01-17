import React, { useMemo } from "react";

import { selectById } from "../reducer/nodes";
import { useNode } from "./Provider";

const Panel = (props: { nodeId: string }) => {
    const { nodeId } = props;
    const [nodes] = useNode();
    const node = useMemo(() => selectById(nodes, nodeId), [nodeId, nodes]);
    return (
        <div style={{ height: "100%", width: "100%", overflow: "hidden" }}>
            {node?.Page ? <node.Page /> : null}
        </div>
    );
};

export default Panel;
