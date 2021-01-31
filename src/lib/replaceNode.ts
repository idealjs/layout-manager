import { EntityState } from "@reduxjs/toolkit";

import { adapter, INode, selectById } from "../reducer/nodes";
import immutableSplice from "./immutableSplice";

const replaceNode = (
    state: EntityState<INode>,
    searchNodeId: string,
    replaceNodeId: string,
    keepOffset: boolean = true
): EntityState<INode> => {
    console.debug("[Info] replaceNode", searchNodeId, replaceNodeId);
    let nextState = state;
    const searchNode = selectById(nextState, searchNodeId);
    if (searchNode?.parentId != null) {
        const searchParent = selectById(nextState, searchNode.parentId);
        if (searchParent?.children != null) {
            const index = searchParent.children.findIndex(
                (childId) => childId === searchNodeId
            );
            if (index !== -1) {
                nextState = adapter.updateMany(nextState, [
                    {
                        id: replaceNodeId,
                        changes: {
                            parentId: searchNode.parentId,
                            offset: keepOffset ? searchNode.offset : 0,
                        },
                    },
                    {
                        id: searchNode.parentId,
                        changes: {
                            children: immutableSplice(
                                searchParent.children,
                                index,
                                1,
                                replaceNodeId
                            ),
                        },
                    },
                ]);
            }
        }
    }
    return nextState;
};

export default replaceNode;
