import { AnyAction } from "@reduxjs/toolkit";
import { Dispatch, RefObject, useEffect } from "react";

import { updateOne } from "../reducer/nodes";
import inRange from "./inRange";

const useUpdateNodeRect = (
    nodeId: string,
    nodeWidth: number,
    nodeHeight: number,
    ref: RefObject<HTMLDivElement>,
    dispatch: Dispatch<AnyAction>
) => {
    useEffect(() => {
        const rectWidth = ref.current?.getBoundingClientRect().width;
        const rectHeight = ref.current?.getBoundingClientRect().height;

        if (
            !inRange(nodeWidth, rectWidth, 1) ||
            !inRange(nodeHeight, rectHeight, 1)
        ) {
            dispatch(
                updateOne({
                    id: nodeId,
                    changes: {
                        width: rectWidth,
                        height: rectHeight,
                    },
                })
            );
        }
    });
};

export default useUpdateNodeRect;
