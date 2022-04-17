import {
    forwardRef,
    ReactNode,
    useEffect,
    useImperativeHandle,
    useRef,
} from "react";
import { createPortal } from "react-dom";

import copyStyles from "./copyStyles";

interface IProps {
    children?: ReactNode;
    onExtBeforeUnload?: () => void;
    onMainBeforeUnload?: () => void;
    afterHook?: (extWindow: Window) => void;
    left?: number;
    top?: number;
}

const PortalWindow = forwardRef<{ close: () => void }, IProps>((props, ref) => {
    const {
        children,
        onExtBeforeUnload,
        onMainBeforeUnload,
        afterHook,
        left,
        top,
    } = props;

    const containerRef = useRef<HTMLDivElement>(document.createElement("div"));
    const externalWindowRef = useRef<Window | null>();

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
                `width=600,height=400,left=${left},top=${top}`
            );
            if (externalWindowRef.current) {
                externalWindowRef.current.document.body.style.margin = "0px";
                externalWindowRef.current.document.body.style.overflow =
                    "hidden";

                externalWindowRef.current.document.body.appendChild(
                    containerRef.current
                );
                copyStyles(window.document, externalWindowRef.current.document);
                afterHook && afterHook(externalWindowRef.current);
            }
        }
    }, [afterHook, left, top]);

    useEffect(() => {
        if (onMainBeforeUnload) {
            window.addEventListener("beforeunload", onMainBeforeUnload);
            return () => {
                window.removeEventListener("beforeunload", onMainBeforeUnload);
            };
        }
    }, [onMainBeforeUnload]);

    useEffect(() => {
        const externalWindow = externalWindowRef.current;
        if (onExtBeforeUnload) {
            externalWindowRef.current?.addEventListener(
                "beforeunload",
                onExtBeforeUnload
            );
            return () => {
                externalWindow?.removeEventListener(
                    "beforeunload",
                    onExtBeforeUnload
                );
            };
        }
    }, [onExtBeforeUnload]);

    return createPortal(children, containerRef.current!);
});

export default PortalWindow;
