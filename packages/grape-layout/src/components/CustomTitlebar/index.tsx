import {
    TitlebarCMPT,
    useLayout,
    useTitlebarHeight,
} from "@idealjs/layout-manager";
import { CSSProperties, useCallback, useMemo, useRef, WheelEvent } from "react";

import CustomTab from "../CustomTab";
import styles from "./index.module.css";

const Titlebar: TitlebarCMPT = (props) => {
    const { children, nodeId } = props;
    const ref = useRef<HTMLDivElement>(null);
    const titlebarHeight = useTitlebarHeight();
    const layout = useLayout(nodeId)!;
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
            className={styles.titlebar}
            style={style}
            onWheel={onWheel}
        >
            {children}
        </div>
    );
};

export default Titlebar;
