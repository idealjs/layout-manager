import React, { Fragment, useEffect, useMemo, useRef } from "react";

import { DIRECTION, NODE_TYPE, selectById, updateOne } from "../reducer/nodes";
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

    useEffect(() => {
        if (
            node?.width !== ref.current?.getBoundingClientRect().width ||
            node?.height !== ref.current?.getBoundingClientRect().height
        ) {
            dispatch(
                updateOne({
                    id: nodeId,
                    changes: {
                        width: ref.current?.getBoundingClientRect().width,
                        height: ref.current?.getBoundingClientRect().height,
                    },
                })
            );
        }
    });

    const style = useMemo(() => {
        const nodeDirection = node?.direction;
        const parentDirection = parent?.direction;
        const length = parent?.children?.length;
        const offset = node?.offset;

        const size = length || 1;
        const splitterOffset = (10 * (size - 1)) / size;

        const width =
            length != null &&
            (parentDirection === DIRECTION.ROW ||
                parentDirection === DIRECTION.ROWREV)
                ? `calc(${100 / (length || 1)}% - ${splitterOffset}px + ${
                      offset || 0
                  }px)`
                : "100%";

        const height =
            length != null &&
            (parentDirection === DIRECTION.COLUMN ||
                parentDirection === DIRECTION.COLUMNREV)
                ? `calc(${100 / (length || 1)}% - ${splitterOffset}px + ${
                      offset || 0
                  }px)`
                : "100%";

        return {
            width,
            height,
            display: "flex",
            flexDirection: nodeDirection,
        };
    }, [node, parent]);

    return (
        <div id={nodeId} ref={ref} style={style}>
            {node?.children?.map((childId, index, array) => {
                const child = selectById(nodes, childId);
                return (
                    <Fragment key={childId}>
                        {child?.type === NODE_TYPE.WIDGET_NODE ? (
                            <Widget key={childId} nodeId={childId} />
                        ) : null}
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
