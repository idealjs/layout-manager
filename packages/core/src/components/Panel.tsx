import { DND_EVENT, IDropData, useDnd } from "@idealjs/drag-drop";
import { useSns } from "@idealjs/sns";
import { CSSProperties, useCallback, useEffect, useMemo, useRef } from "react";

import { MASK_PART, SLOT_EVENT } from "../enum";
import useStateRef from "../hooks/useStateRef";
import PanelNode from "../lib/PanelNode";
import { usePanel } from "../stores/panels";
import { ADD_PANEL_DATA, MOVE_PANEL_DATA, REMOVE_PANEL_DATA } from "../type";
import { useFactory } from "./Provider";
import { useLayoutSymbol } from "./providers/LayoutSymbolProvider";

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

const Panel = (props: { nodeId: string }) => {
    const { nodeId } = props;
    const ref = useRef<HTMLDivElement>(null);
    const panel = usePanel(nodeId)!;
    const [maskPartRef, maskPart, setMaskPart] = useStateRef<MASK_PART | null>(
        null
    );
    const dnd = useDnd();
    const sns = useSns();
    const layoutSymbol = useLayoutSymbol();
    const hidden = useMemo(() => !panel.selected, [panel.selected]);
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

    const onDrop = useCallback(
        (
            data: IDropData<{
                id: string;
                data: any;
                page: string;
                type: string;
                layoutSymbol: string | number;
            }>
        ) => {
            console.debug("[Debug] onDrop", data);
            if (data.item?.type === "Tab") {
                if (maskPartRef.current != null) {
                    if (data.item.layoutSymbol === layoutSymbol) {
                        sns.send(layoutSymbol, SLOT_EVENT.MOVE_PANEL, {
                            search: data.item.id,
                            target: nodeId,
                            mask: maskPartRef.current,
                        } as MOVE_PANEL_DATA);
                    } else {
                        sns.send(layoutSymbol, SLOT_EVENT.ADD_PANEL, {
                            panelNode: new PanelNode({
                                panelJSON: {
                                    id: data.item.id,
                                    data: data.item.data,
                                    page: data.item.page,
                                },
                            }),
                            mask: maskPartRef.current,
                            target: nodeId,
                        } as ADD_PANEL_DATA);
                        sns.send(
                            data.item.layoutSymbol,
                            SLOT_EVENT.REMOVE_PANEL,
                            {
                                search: data.item.id,
                            } as REMOVE_PANEL_DATA
                        );
                    }
                }
                setMaskPart(null);
            }
        },
        [layoutSymbol, maskPartRef, nodeId, setMaskPart, sns]
    );

    const onDragLeave = useCallback(
        (data: IDropData<{ type: string }>) => {
            if (data.item?.type === "Tab") {
                setMaskPart(null);
            }
        },
        [setMaskPart]
    );

    const onDragOver = useCallback(
        (data: IDropData<{ type: string }>) => {
            if (data.item?.type === "Tab") {
                const rect = ref.current?.getBoundingClientRect();
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
                .droppable(ref.current!, {
                    crossWindow: true,
                })
                .addListener(DND_EVENT.DROP, onDrop)
                .addListener(DND_EVENT.DRAG_LEAVE, onDragLeave)
                .addListener(DND_EVENT.DRAG_OVER, onDragOver);
            return () => {
                listenable
                    .removeListener(DND_EVENT.DROP, onDrop)
                    .removeListener(DND_EVENT.DRAG_LEAVE, onDragLeave)
                    .removeListener(DND_EVENT.DRAG_OVER, onDragOver)
                    .removeEleListeners();
            };
        } catch (error) {
            console.error(error);
        }
    }, [dnd, onDragLeave, onDragOver, onDrop]);

    const node = usePanel(nodeId);
    const factory = useFactory();
    const Page = useMemo(
        () => factory(node?.page!, node?.data),
        [factory, node?.data, node?.page]
    );
    return (
        <div
            ref={ref}
            id={panel.id}
            key={panel.id}
            style={{
                position: "absolute",
                height: panel.height,
                width: panel.width,
                left: panel.left,
                top: panel.top,

                overflow: "hidden",
                backgroundColor: "#dcdcdd",
                visibility: hidden ? "hidden" : undefined,
            }}
        >
            <div style={maskPartStyle} />
            {Page ? <Page nodeData={node?.data} /> : null}
        </div>
    );
};

export default Panel;
