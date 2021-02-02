import { ILayoutNode, INode, NODE_TYPE } from "../reducer/nodes";

const isLayoutNode = (node: INode | undefined): node is ILayoutNode => {
    return node?.type === NODE_TYPE.LAYOUT_NODE;
};

export default isLayoutNode;
