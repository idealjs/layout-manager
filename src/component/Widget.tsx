import { CSSProperties, useCallback, useEffect, useMemo, useRef } from "react";

import { SLOT_EVENT } from "../enum";
import useStateContainer from "../hook/useStateContainer";
import { DND_EVENT, useDnd } from "../lib/dnd";
import Panel from "./Panel";
import { useLayout } from "./Provider/LayoutsProvider";
import { useLayoutSymbol } from "./Provider/LayoutSymbolProvider";
import { usePanels } from "./Provider/PanelsProvider";
import { useSlot, useSns } from "./Provider/SnsProvider";
import Titlebar from "./Titlebar";
export enum MASK_PART {
    TOP = "top",
    LEFT = "left",
    BOTTOM = "bottom",
    RIGHT = "right",
    CENTER = "center",
}

const top: CSSProperties = {
    zIndex: 1,
    pointerEvents: "none",
    border: "2px dashed",
    position: "absolute",
    width: "calc(100% - 4px)",
    height: "50%",
    top: 0,
    left: 0,
};
const left: CSSProperties = {
    zIndex: 1,
    pointerEvents: "none",
    border: "2px dashed",
    position: "absolute",
    width: "50%",
    height: "calc(100% - 4px)",
    top: 0,
    left: 0,
};
const bottom: CSSProperties = {
    zIndex: 1,
    pointerEvents: "none",
    border: "2px dashed",
    position: "absolute",
    width: "calc(100% - 4px)",
    height: "50%",
    right: 0,
    bottom: 0,
};
const right: CSSProperties = {
    zIndex: 1,
    pointerEvents: "none",
    border: "2px dashed",
    position: "absolute",
    width: "50%",
    height: "calc(100% - 4px)",
    bottom: 0,
    right: 0,
};
const center: CSSProperties = {
    zIndex: 1,
    pointerEvents: "none",
    border: "2px dashed",
    position: "absolute",
    width: "calc(100% - 4px)",
    height: "calc(100% - 4px)",
    bottom: 0,
    right: 0,
};
const hide: CSSProperties = {
    display: "none",
};

const Widget = (props: { nodeId: string }) => {
    const { nodeId } = props;
    const widgetRef = useRef<HTMLDivElement>(null);
    const [
        maskPartContainer,
        maskPart,
        setMaskPart,
    ] = useStateContainer<MASK_PART | null>(null);

    const dnd = useDnd();
    const sns = useSns();
    const symbol = useMemo(() => Symbol(nodeId), [nodeId]);
    const slot = useSlot(symbol);
    const layoutSymbol = useLayoutSymbol();
    const [panels] = usePanels();
    const layout = useLayout(nodeId);

    const tabs = useMemo(() => {
        return panels.filter((p) => p.parentId === nodeId);
    }, [nodeId, panels]);

    const selectedNode = useMemo(() => {
        return panels
            .filter((p) => p.parentId === nodeId)
            .find((p) => p.selected === true);
    }, [nodeId, panels]);

    const widgetStyle: CSSProperties = useMemo(() => {
        const width = "100%";
        const height = "100%";
        return {
            width,
            height,
            userSelect: "none",
        };
    }, []);

    const maskPartStyle = useMemo(() => {
        switch (maskPart) {
            case MASK_PART.BOTTOM:
                return bottom;
            case MASK_PART.CENTER:
                return center;
            case MASK_PART.LEFT:
                return left;
            case MASK_PART.RIGHT:
                return right;
            case MASK_PART.TOP:
                return top;
            default:
                return hide;
        }
    }, [maskPart]);

    useEffect(() => {
        console.log("slot change", slot);
    }, [slot]);

    const onNodeRemoved = useCallback(
        (data) => {
            console.log(SLOT_EVENT.NODE_REMOVED, data, nodeId);
            // slot.removeListener(SLOT_EVENT.NODE_REMOVED, onNodeRemoved);
        },
        [nodeId]
    );

    const onDrop = useCallback(
        (data) => {
            if (data.item.type === "Tab") {
                if (maskPartContainer.current != null) {
                    // const { type, ...node } = data.item;
                    console.log(nodeId, data, data.item.layoutSymbol);
                    slot.addListener(SLOT_EVENT.NODE_REMOVED, onNodeRemoved);
                    sns.send(data.item.layoutSymbol, SLOT_EVENT.REMOVE_NODE, {
                        ...data,
                        item: { ...data.item, symbol: symbol },
                    });
                }
                setMaskPart(null);
            }
        },
        [
            maskPartContainer,
            nodeId,
            onNodeRemoved,
            setMaskPart,
            slot,
            sns,
            symbol,
        ]
    );

    const onDragLeave = useCallback(
        (data) => {
            if (data.item.type === "Tab") {
                setMaskPart(null);
            }
        },
        [setMaskPart]
    );

    const onDragOver = useCallback(
        (data) => {
            if (data.item.type === "Tab") {
                const rect = widgetRef.current?.getBoundingClientRect();
                if (rect) {
                    if (
                        data.clientPosition.x > rect.x + rect.width / 4 &&
                        data.clientPosition.x < rect.x + (rect.width / 4) * 3 &&
                        data.clientPosition.y > rect.y + rect.height / 4 &&
                        data.clientPosition.y < rect.y + (rect.height / 4) * 3
                    ) {
                        setMaskPart(MASK_PART.CENTER);
                        return;
                    }
                    if (
                        data.clientPosition.x > rect.x &&
                        data.clientPosition.x < rect.x + rect.width / 4
                    ) {
                        setMaskPart(MASK_PART.LEFT);
                        return;
                    }

                    if (
                        data.clientPosition.x > rect.x + (rect.width / 4) * 3 &&
                        data.clientPosition.x < rect.x + rect.width
                    ) {
                        setMaskPart(MASK_PART.RIGHT);
                        return;
                    }

                    if (
                        data.clientPosition.y > rect.y &&
                        data.clientPosition.y < rect.y + rect.height / 4
                    ) {
                        setMaskPart(MASK_PART.TOP);
                        return;
                    }

                    if (
                        data.clientPosition.y >
                            rect.y + (rect.height / 4) * 3 &&
                        data.clientPosition.y < rect.y + rect.height
                    ) {
                        setMaskPart(MASK_PART.BOTTOM);
                        return;
                    }
                }
            }
        },
        [setMaskPart]
    );

    useEffect(() => {
        try {
            const listenable = dnd
                .droppable(widgetRef.current!, true)
                .addListener(DND_EVENT.DROP, onDrop)
                .addListener(DND_EVENT.DRAG_LEAVE, onDragLeave)
                .addListener(DND_EVENT.DRAG_OVER, onDragOver);
            return () => {
                listenable
                    .removeListener(DND_EVENT.DROP, onDrop)
                    .removeListener(DND_EVENT.DRAG_LEAVE, onDragLeave)
                    .removeListener(DND_EVENT.DRAG_OVER, onDragOver);
            };
        } catch (error) {
            console.error(error);
        }
    }, [
        dnd,
        layoutSymbol,
        maskPartContainer,
        nodeId,
        onDragLeave,
        onDragOver,
        onDrop,
        onNodeRemoved,
        setMaskPart,
        slot,
        sns,
    ]);

    return (
        <div style={widgetStyle}>
            <Titlebar nodeIds={tabs.map((t) => t.id)} />
            <div
                ref={widgetRef}
                style={{ position: "relative", height: "calc(100% - 25px)" }}
            >
                <div style={maskPartStyle} />
                {layout?.children.map((childId, index, array) => {
                    const hidden =
                        selectedNode?.id !== childId &&
                        !(index === 0 && selectedNode == null);
                    return (
                        <Panel key={childId} nodeId={childId} hidden={hidden} />
                    );
                })}
            </div>
        </div>
    );
};

export default Widget;
