import { useState } from "react";
import { useEffect } from "react";
import { FC } from "react";
import { createPortal } from "react-dom";
import { useStateRef } from "@idealjs/layout-manager";
import { useCallback } from "react";
import { usePopout } from "./Popout";

const Portal: FC<{ id: string }> = (props) => {
    const { children, id } = props;
    const [container] = useState(document.createElement("div"));
    const [
        externalWindowRef,
        externalWindow,
        setExternalWindow,
    ] = useStateRef<Window | null>(null);
    const { setPortalState } = usePopout();

    const onMainBeforeunload = useCallback(() => {
        externalWindowRef.current?.close();
    }, [externalWindowRef]);

    const onExternalBeforeunload = useCallback(() => {
        setPortalState((state) => state.filter((d) => d !== id));
    }, [id, setPortalState]);

    useEffect(() => {
        container.style.height = "400px";
        container.style.width = "600px";
        const externalWindow = window.open(
            "",
            "",
            "width=600,height=400,left=200,top=200"
        );
        externalWindow?.document.body.appendChild(container);
        if (externalWindow != null) {
            externalWindow.document.body.style.margin = "0px";
            externalWindow.document.body.style.overflow = "hidden";
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

    return createPortal(children, container);
};

export default Portal;
