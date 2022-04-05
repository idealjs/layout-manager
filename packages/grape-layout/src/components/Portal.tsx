import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { useEffect } from "react";
import { useCallback } from "react";
import { createPortal } from "react-dom";

import { sheet as customTabSheet } from "./CustomTab";
import { sheet as customTitlebarSheet } from "./CustomTitlebar";
import { usePortals } from "./PopoutManager";

const Portal = forwardRef<
    { close: () => void },
    { id: string | number; children: React.ReactNode }
>((props, ref) => {
    const { children, id } = props;

    const containerRef = useRef<HTMLDivElement>(document.createElement("div"));

    const externalWindowRef = useRef<Window | null>();

    const { setPortals } = usePortals();

    const onMainBeforeunload = useCallback(() => {
        externalWindowRef.current?.close();
    }, [externalWindowRef]);

    const onExternalBeforeunload = useCallback(() => {
        setPortals((state) => state.filter((d) => d !== id));
    }, [id, setPortals]);

    useImperativeHandle(
        ref,
        () => ({
            close: () => {
                externalWindowRef.current?.close();
            },
        }),
        []
    );

    useEffect(() => {
        if (externalWindowRef.current == null) {
            externalWindowRef.current = window.open(
                "",
                "",
                "width=600,height=400,left=200,top=200"
            );
        }
        if (externalWindowRef.current != null) {
            externalWindowRef.current.document.body.style.margin = "0px";
            externalWindowRef.current.document.body.style.overflow = "hidden";
            const style = externalWindowRef.current.document.head.appendChild(
                externalWindowRef.current.document.createElement("style")
            );
            style.textContent = "".concat(
                customTitlebarSheet.toString(),
                customTabSheet.toString()
            );
            externalWindowRef.current?.document.body.appendChild(
                containerRef.current
            );
        }
        return () => {
            // externalWindowRef.current?.close();
        };
    }, []);

    useEffect(() => {
        window.addEventListener("beforeunload", onMainBeforeunload);
        return () => {
            window.removeEventListener("beforeunload", onMainBeforeunload);
        };
    }, [onMainBeforeunload]);

    useEffect(() => {
        const externalWindow = externalWindowRef.current;
        externalWindowRef.current?.addEventListener(
            "beforeunload",
            onExternalBeforeunload
        );
        return () => {
            externalWindow?.removeEventListener(
                "beforeunload",
                onExternalBeforeunload
            );
        };
    }, [onExternalBeforeunload]);

    return createPortal(children, containerRef.current!);
});

export default Portal;
