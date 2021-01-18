import { useMemo } from "react";

import { selectById } from "../reducer/nodes";
import { useFactory, useNode } from "./Provider";

const Panel = (props: { nodeId: string }) => {
    const { nodeId } = props;
    const [nodes] = useNode();
    const node = useMemo(() => selectById(nodes, nodeId), [nodeId, nodes]);
    const factory = useFactory();

    const Page = useMemo(() => factory(node?.page!), [factory, node?.page]);
    return (
        <div style={{ height: "100%", width: "100%", overflow: "hidden" }}>
            {Page ? <Page /> : null}
        </div>
    );
};

export default Panel;
