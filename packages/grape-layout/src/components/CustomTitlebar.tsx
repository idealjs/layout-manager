import {
    TitlebarCMPT,
    useCustomTab,
    useLayout,
    useTitlebarHeight,
} from "@idealjs/layout-manager";
import clsx from "clsx";
import { CSSProperties, useCallback, useMemo, useRef, WheelEvent } from "react";
import jss from "jss";
import preset from "jss-preset-default";

export const sheet = jss
    .setup(preset())
    .createStyleSheet({
        scroll: {
            "&::-webkit-scrollbar-thumb": {
                background: "#5464e2",
            },
            "&::-webkit-scrollbar": {
                height: "1px",
            },
        },
    })
    .attach();

const Titlebar: TitlebarCMPT = (props: { nodeId: string }) => {
    const { nodeId } = props;
    const ref = useRef<HTMLDivElement>(null);
    const titlebarHeight = useTitlebarHeight();
    const layout = useLayout(nodeId)!;
    const CustomTab = useCustomTab();
    const onWheel = useCallback((e: WheelEvent<HTMLDivElement>) => {
        ref.current?.scrollTo({
            left: ref.current?.scrollLeft + e.deltaY * 1.5,
            behavior: "smooth",
        });
    }, []);
    const style: CSSProperties = useMemo(
        () => ({
            position: "absolute",
            display: "flex",
            userSelect: "none",
            backgroundColor: "#c5c3c6",
            overflowY: "hidden",
            overflowX: "scroll",
            height: `${titlebarHeight}px`,
            width: layout.width,
            left: layout.left,
            top: layout.top,
        }),
        [layout, titlebarHeight]
    );
    return (
        <div
            ref={ref}
            className={clsx(sheet.classes.scroll)}
            style={style}
            onWheel={onWheel}
        >
            {layout.children.map((id) => (
                <CustomTab key={id} nodeId={id} />
            ))}
        </div>
    );
};

export default Titlebar;
