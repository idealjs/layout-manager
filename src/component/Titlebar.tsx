import { useCallback, useEffect, useState } from "react";

import Tab from "./Tab";

const Titlebar = (props: { nodeIds: string[] }) => {
    const { nodeIds } = props;
    const [selected, setSelected] = useState("");

    useEffect(() => {
        if (!nodeIds.includes(selected)) {
            setSelected(nodeIds[0]);
        }
    }, [nodeIds, selected]);

    const onSelect = useCallback((nodeId: string) => {
        setSelected(nodeId);
    }, []);

    return (
        <div
            style={{
                height: "25px",
                display: "flex",
                userSelect: "none",
                backgroundColor: "#c5c3c6",
            }}
        >
            {nodeIds.map((id) => (
                <Tab
                    key={id}
                    nodeId={id}
                    selected={selected}
                    onSelect={onSelect}
                />
            ))}
        </div>
    );
};

export default Titlebar;
