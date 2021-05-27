import { useCustomTab, useLayout } from "@idealjs/layout-manager";
import { createUseStyles } from "react-jss";
import clsx from "clsx";

const useStyles = createUseStyles({
    test: {
        "&::-webkit-scrollbar-thumb": {
            background: "#888",
        },
        "&::-webkit-scrollbar": {
            height: "1px",
        },
    },
});

const Titlebar = (props: { nodeId: string }) => {
    const { nodeId } = props;
    const classes = useStyles();
    const layout = useLayout(nodeId)!;
    const CustomTab = useCustomTab();

    return (
        <div
            className={clsx(classes.test)}
            style={{
                position: "absolute",
                height: "25px",
                width: layout.width,
                left: layout.left,
                top: layout.top,
                display: "flex",
                userSelect: "none",
                backgroundColor: "#c5c3c6",
                overflowY: "hidden",
                overflowX: "scroll",
            }}
        >
            {layout.children.map((id) => (
                <CustomTab key={id} nodeId={id} />
            ))}
        </div>
    );
};

export default Titlebar;
