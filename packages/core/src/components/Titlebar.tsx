import { useLayout } from "../stores/layouts";
import { TitlebarCMPT } from "../type";

const Titlebar: TitlebarCMPT = (props) => {
    const { children, nodeId } = props;
    const layout = useLayout(nodeId)!;
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
            {children}
        </div>
    );
};

export default Titlebar;
