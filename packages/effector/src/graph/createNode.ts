import CommonNode from "../classes/CommonNode";
import CommonUnit from "../classes/CommonUnit";

function createNode<Weight>(
    unit: CommonUnit<any[], any, any>,
    weight?: Weight
) {
    return new CommonNode(unit, weight);
}

export default createNode;
