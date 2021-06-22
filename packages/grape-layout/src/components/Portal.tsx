import { useState } from "react";
import { useEffect } from "react";
import { FC } from "react";
import { createPortal } from "react-dom";
import { useStateRef } from "@idealjs/layout-manager";
import { useCallback } from "react";
import { usePortals } from "./PopoutManager";
import { sheet as customTitlebarSheet } from "./CustomTitlebar";
import { sheet as customTabSheet } from "./CustomTab";
const Portal: FC<{ id: string | number }> = (props) => {
    const { children, id } = props;
    const [container] = useState(document.createElement("div"));
    const [externalWindowRef, externalWindow, setExternalWindow] =
        useStateRef<Window | null>(null);
    const { setPortals } = usePortals();

    const onMainBeforeunload = useCallback(() => {
        externalWindowRef.current?.close();
    }, [externalWindowRef]);

    const onExternalBeforeunload = useCallback(() => {
        setPortals((state) => state.filter((d) => d !== id));
    }, [id, setPortals]);

    useEffect(() => {
        container.style.height = "100%";
        container.style.width = "100%";
        const externalWindow = window.open(
            "",
            "",
            "width=600,height=400,left=200,top=200"
        );
        externalWindow?.document.body.appendChild(container);
        if (externalWindow != null) {
            externalWindow.document.body.style.margin = "0px";
            externalWindow.document.body.style.overflow = "hidden";
            const style = externalWindow.document.head.appendChild(
                externalWindow.document.createElement("style")
            );
            style.textContent = "".concat(
                customTitlebarSheet.toString(),
                customTabSheet.toString()
            );
        }
        setExternalWindow(externalWindow);
        window.addEventListener("beforeunload", onMainBeforeunload);
    }, [container, onMainBeforeunload, setExternalWindow]);

    useEffect(() => {
        externalWindow?.addEventListener(
            "beforeunload",
            onExternalBeforeunload
        );
        return () => {
            externalWindow?.removeEventListener(
                "beforeunload",
                onExternalBeforeunload
            );
        };
    }, [externalWindow, onExternalBeforeunload]);

    useEffect(() => {
        return () => {
            externalWindow?.close();
        };
    }, [externalWindow]);

    return createPortal(children, container);
};

export default Portal;
