import {
    TitlebarCMPT,
    useCustomTab,
    useLayout,
    useTitlebarHeight,
} from "@idealjs/layout-manager";
import { createUseStyles } from "react-jss";
import clsx from "clsx";
import { useCallback, useRef, WheelEvent } from "react";

const useStyles = createUseStyles({
    scroll: {
        "&::-webkit-scrollbar-thumb": {
            background: "#5464e2",
        },
        "&::-webkit-scrollbar": {
            height: "1px",
        },
    },
});

const Titlebar: TitlebarCMPT = (props: { nodeId: string }) => {
    const { nodeId } = props;
    const ref = useRef<HTMLDivElement>(null);
    const classes = useStyles();
    const layout = useLayout(nodeId)!;
    const CustomTab = useCustomTab();
    const onWheel = useCallback((e: WheelEvent<HTMLDivElement>) => {
        ref.current?.scrollTo({
            left: ref.current?.scrollLeft + e.deltaY * 1.5,
            behavior: "smooth",
        });
    }, []);
    const titlebarHeight = useTitlebarHeight();
    return (
        <div
            ref={ref}
            className={clsx(classes.scroll)}
            style={{
                position: "absolute",
                height: `${titlebarHeight}px`,
                width: layout.width,
                left: layout.left,
                top: layout.top,
                display: "flex",
                userSelect: "none",
                backgroundColor: "#c5c3c6",
                overflowY: "hidden",
                overflowX: "scroll",
            }}
            onWheel={onWheel}
        >
            {layout.children.map((id) => (
                <CustomTab key={id} nodeId={id} />
            ))}
        </div>
    );
};

export default Titlebar;
