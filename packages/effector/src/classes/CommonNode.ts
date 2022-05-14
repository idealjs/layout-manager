import { IUnit } from "./CommonUnit";

class CommonNode<Weight> {
    public commonUnit: IUnit<any[], any, any>;
    public weight: Weight;
    constructor(commonUnit: IUnit<any[], any, any>, weight: Weight) {
        this.commonUnit = commonUnit;
        this.weight = weight;
    }
}

export default CommonNode;
