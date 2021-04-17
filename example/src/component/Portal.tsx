import { useState } from "react";
import { useEffect } from "react";
import { FC } from "react";
import { createPortal } from "react-dom";
import { useLayoutSymbol, useStateRef } from "@idealjs/layout-manager";
import { useCallback } from "react";

const Portal: FC = (props) => {
    const { children } = props;
    const [container] = useState(document.createElement("div"));
    const [externalWindowRef, , setExternalWindow] = useStateRef<Window | null>(
        null
    );
    const layoutSymbol = useLayoutSymbol();
    useEffect(() => {
        console.log("test test update", layoutSymbol.toString());
    });

    const onbeforeunload = useCallback(() => {
        externalWindowRef.current?.close();
    }, [externalWindowRef]);

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
        window.addEventListener("beforeunload", onbeforeunload);
    }, [container, onbeforeunload, setExternalWindow]);

    return createPortal(children, container);
};

export default Portal;
