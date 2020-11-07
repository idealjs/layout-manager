import React, { useContext, useMemo } from "react";

import { selectById } from "../reducer/nodes";
import { context } from "./Provider";

const Panel = (props: { nodeId: string }) => {
    const { nodeId } = props;
    const [nodes] = useContext(context)!;
    const node = useMemo(() => selectById(nodes, nodeId), [nodeId, nodes]);
    return (
        <div style={{ height: "100%", width: "100%", overflow: "hidden" }}>
            {node?.Page ? <node.Page /> : null}
        </div>
    );
};

export default Panel;
