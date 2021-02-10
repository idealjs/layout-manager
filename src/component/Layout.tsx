import { Fragment, useMemo, useRef } from "react";

import useUpdateNodeRect from "../lib/useUpdateNodeRect";
import { DIRECTION, NODE_TYPE, selectById } from "../reducer/nodes";
import { useNode } from "./Provider";
import Splitter from "./Splitter";
import Widget from "./Widget";

const Layout = (props: { nodeId: string }) => {
    const { nodeId } = props;
    const ref = useRef<HTMLDivElement>(null);
    const [nodes, dispatch] = useNode();
    const node = useMemo(() => selectById(nodes, nodeId), [nodeId, nodes]);
    const parent = useMemo(() => {
        if (node?.parentId) {
            return selectById(nodes, node?.parentId);
        }
    }, [node?.parentId, nodes]);

    const nodeWidth = useMemo(() => (node?.width ? node.width : 0), [
        node?.width,
    ]);
    const nodeHeight = useMemo(() => (node?.height ? node.height : 0), [
        node?.height,
    ]);

    useUpdateNodeRect(nodeId, nodeWidth, nodeHeight, ref, dispatch);

    const style = useMemo(() => {
        const nodeDirection = node?.direction;
        const parentDirection = parent?.direction;
        const length = parent?.children?.length;
        const offset = node?.offset;

        const size = length || 1;
        const splitterOffset = (10 * (size - 1)) / size;

        const width =
            length != null && parentDirection === DIRECTION.ROW
                ? `calc(${100 / (length || 1)}% - ${splitterOffset}px + ${
                      offset || 0
                  }px)`
                : "100%";

        const height =
            length != null && parentDirection === DIRECTION.COLUMN
                ? `calc(${100 / (length || 1)}% - ${splitterOffset}px + ${
                      offset || 0
                  }px)`
                : "100%";

        return {
            width,
            height,
            flexDirection: nodeDirection as Exclude<DIRECTION, "tab">,
        };
    }, [
        node?.direction,
        node?.offset,
        parent?.children?.length,
        parent?.direction,
    ]);

    return node?.direction === DIRECTION.TAB ? (
        <div id={nodeId} ref={ref} style={{ ...style, display: "flex" }}>
            <Widget nodeId={nodeId} />
        </div>
    ) : (
        <div id={nodeId} ref={ref} style={{ ...style, display: "flex" }}>
            {node?.children?.map((childId, index, array) => {
                const child = selectById(nodes, childId);
                return (
                    <Fragment key={childId}>
                        {child?.type === NODE_TYPE.LAYOUT_NODE ? (
                            <Layout key={childId} nodeId={childId} />
                        ) : null}

                        {array.length === index + 1 ? null : (
                            <Splitter
                                parentId={nodeId}
                                primaryId={childId}
                                secondaryId={array[index + 1]}
                            />
                        )}
                    </Fragment>
                );
            })}
        </div>
    );
};

export default Layout;
