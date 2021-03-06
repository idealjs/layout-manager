import { EntityState } from "@reduxjs/toolkit";
import { useEffect, useMemo } from "react";

import { useLayouts } from "../component/Provider/LayoutsProvider";
import { useSplitters } from "../component/Provider/SplittersProvider";
import { useWidgets } from "../component/Provider/WidgetsProvider";
import { ROOTID } from "../constant";
import {
    adapter as layoutAdapter,
    selectAll,
    selectById as selectLayoutById,
} from "../reducer/layouts";
import { ILayoutNode, ISplitterNode, LAYOUT_DIRECTION } from "../reducer/type";
import { setAll as setAllWidgets } from "../reducer/widgets";

const traverse = (
    state: EntityState<ILayoutNode>,
    nodeId: string,
    index: number,
    callback: (
        nodeId: ILayoutNode,
        index: number,
        state: EntityState<ILayoutNode>
    ) => EntityState<ILayoutNode>
): EntityState<ILayoutNode> => {
    let nextState = state;
    const node = selectLayoutById(nextState, nodeId);
    if (node != null) {
        nextState = callback(node, index, state);
    }
    return (
        node?.children?.reduce((prevState, childId, index) => {
            return traverse(prevState, childId, index, callback);
        }, nextState) || nextState
    );
};

const splitterBlock = 10;

const useParse = (rect: {
    height: number;
    width: number;
}): [ILayoutNode[], ISplitterNode[]] => {
    const [, layoutNodes] = useLayouts();
    const [, , dispatch] = useWidgets();
    const [, splitterNodes] = useSplitters();
    console.debug("[Debug] useParse layoutNodes", layoutNodes);
    const [layouts, splitters] = useMemo((): [
        ILayoutNode[],
        ISplitterNode[]
    ] => {
        const splitters: ISplitterNode[] = [];

        const nextLayoutNodes = traverse(
            layoutNodes,
            ROOTID,
            0,
            (layoutNode, index, callbackState) => {
                let nextState = callbackState;

                let height = layoutNode.height || 0;
                let width = layoutNode.width || 0;
                let left = layoutNode.left || 0;
                let top = layoutNode.top || 0;

                if (layoutNode.id === ROOTID) {
                    height = rect.height;
                    width = rect.width;
                    left = 0;
                    top = 0;
                }

                const length = layoutNode.children.length;

                nextState = layoutNode.children.reduce(
                    (previousValue, currentValue, currentIndex) => {
                        if (layoutNode.direction === LAYOUT_DIRECTION.TAB) {
                            return previousValue;
                        }
                        const currentNode = selectLayoutById(
                            previousValue,
                            currentValue
                        );

                        let childHeight = 0;
                        let childWidth = 0;
                        let childLeft = 0;
                        let childTop = 0;

                        let avgHeight = 0;
                        let avgWidth = 0;

                        let splitterHeight = 0;
                        let splitterWidth = 0;
                        let splitterLeft = 0;
                        let splitterTop = 0;

                        if (layoutNode.direction === LAYOUT_DIRECTION.COL) {
                            avgHeight =
                                (height - (length - 1) * splitterBlock) /
                                length;
                            avgWidth = width;

                            childHeight =
                                avgHeight +
                                ((currentNode?.primaryOffset || 0) +
                                    (currentNode?.secondaryOffset || 0));
                            childWidth = avgWidth;
                            childLeft = left;
                            childTop =
                                currentIndex * avgHeight +
                                top +
                                currentIndex * splitterBlock -
                                (currentNode?.primaryOffset || 0);

                            splitterHeight = splitterBlock;
                            splitterWidth = width;
                            splitterLeft = left;
                            splitterTop =
                                currentIndex * avgHeight +
                                top -
                                (currentNode?.primaryOffset || 0);
                        }

                        if (layoutNode.direction === LAYOUT_DIRECTION.ROW) {
                            avgHeight = height;
                            avgWidth =
                                (width - (length - 1) * splitterBlock) / length;

                            childHeight = avgHeight;
                            childWidth =
                                avgWidth +
                                ((currentNode?.primaryOffset || 0) +
                                    (currentNode?.secondaryOffset || 0));
                            childLeft =
                                currentIndex * avgWidth +
                                left +
                                currentIndex * splitterBlock -
                                (currentNode?.primaryOffset || 0);
                            childTop = top;
                            splitterHeight = height;
                            splitterWidth = splitterBlock;
                            splitterLeft =
                                currentIndex * avgWidth +
                                left -
                                (currentNode?.primaryOffset || 0);
                            splitterTop = top;
                        }

                        if (currentIndex !== 0) {
                            const primaryId =
                                layoutNode.children[currentIndex - 1];
                            const secondaryId =
                                layoutNode.children[currentIndex];
                            const parentId = layoutNode.id;

                            splitters.push({
                                id: `${parentId}-${primaryId}-${secondaryId}`,
                                primaryId: primaryId,
                                secondaryId: secondaryId,
                                parentId: parentId,
                                height: splitterHeight,
                                width: splitterWidth,
                                left: splitterLeft,
                                top: splitterTop,
                                offset: 0,
                            });
                        }

                        return layoutAdapter.updateOne(previousValue, {
                            id: currentValue,
                            changes: {
                                height: childHeight,
                                width: childWidth,
                                left: childLeft,
                                top: childTop,
                            },
                        });
                    },
                    nextState
                );

                return nextState;
            }
        );
        return [selectAll(nextLayoutNodes), splitters];
    }, [layoutNodes, rect.height, rect.width]);

    useEffect(() => {
        dispatch(setAllWidgets(layouts));
    }, [dispatch, layouts]);

    const widgets = useMemo(() => {
        return layouts.filter(
            (node) => node.direction === LAYOUT_DIRECTION.TAB
        );
    }, [layouts]);

    return [widgets, splitters];
};

export default useParse;
