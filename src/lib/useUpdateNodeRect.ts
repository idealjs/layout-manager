import { RefObject, useEffect, useMemo, useRef } from "react";

import inRange from "./inRange";

const useUpdateNodeRect = (nodeId: string, ref: RefObject<HTMLDivElement>) => {
    // const nodeHeight = useMemo(() => (node?.height ? node.height : 0), [
    //     node?.height,
    // ]);
    // const nodeWidth = useMemo(() => (node?.width ? node.width : 0), [
    //     node?.width,
    // ]);
    // useEffect(() => {
    //     const rectWidth = ref.current?.getBoundingClientRect().width;
    //     const rectHeight = ref.current?.getBoundingClientRect().height;
    //     if (
    //         !inRange(nodeWidth, rectWidth, 1) ||
    //         !inRange(nodeHeight, rectHeight, 1)
    //     ) {
    //         dispatch(
    //             updateOne({
    //                 id: nodeId,
    //                 changes: {
    //                     width: rectWidth,
    //                     height: rectHeight,
    //                     left: 0,
    //                     top: 0,
    //                 },
    //             })
    //         );
    //     }
    // });
};

export default useUpdateNodeRect;
