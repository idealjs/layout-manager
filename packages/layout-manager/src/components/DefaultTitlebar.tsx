import { TitlebarCMPT } from "../type";
import { useCustomTab } from "./Provider";
import { useLayout } from "./providers/LayoutsProvider";

const DefaultTitlebar: TitlebarCMPT = (props) => {
    const { nodeId } = props;
    const layout = useLayout(nodeId)!;
    const CustomTab = useCustomTab();
    return (
        <div
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
                <CustomTab key={id} nodeId={id} />
            ))}
        </div>
    );
};

export default DefaultTitlebar;
