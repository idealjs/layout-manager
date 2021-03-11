import { useMemo } from "react";

import { useFactory } from "./Provider";
import { usePanel } from "./Provider/PanelsProvider";

const Panel = (props: { nodeId: string; hidden: boolean }) => {
    const { nodeId, hidden } = props;
    const node = usePanel(nodeId);
    const factory = useFactory();
    const Page = useMemo(() => factory(node?.page!), [factory, node?.page]);
    return (
        <div
            style={{
                height: "100%",
                width: "100%",
                overflow: "hidden",
                backgroundColor: "#dcdcdd",
                visibility: hidden ? "hidden" : undefined,
                display: hidden ? "none" : undefined,
            }}
        >
            {Page ? <Page nodeData={node?.data} /> : null}
        </div>
    );
};

export default Panel;
