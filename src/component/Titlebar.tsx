import { useLayout } from "./Provider/LayoutsProvider";
import Tab from "./Tab";

const Titlebar = (props: { nodeId: string }) => {
    const { nodeId } = props;
    const layout = useLayout(nodeId)!;

    return (
        <div
            id={layout.id}
            key={layout.id}
            style={{
                position: "absolute",
                height: "25px",
                width: layout.width,
                left: layout.left,
                top: layout.top,
                display: "flex",
                userSelect: "none",
                backgroundColor: "#c5c3c6",
            }}
        >
            {layout.children.map((id) => (
                <Tab key={id} nodeId={id} />
            ))}
        </div>
    );
};

export default Titlebar;
