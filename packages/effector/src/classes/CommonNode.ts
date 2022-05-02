import CommonUnit from "./CommonUnit";

class CommonNode<Weight> {
    public commonUnit: CommonUnit<any[], any, any>;
    public weight: Weight;
    constructor(commonUnit: CommonUnit<any[], any, any>, weight: Weight) {
        this.commonUnit = commonUnit;
        this.weight = weight;
    }
}

export default CommonNode;
