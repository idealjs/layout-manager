import CommonUnit from "./CommonUnit";

class CommonNode<Params extends unknown[], Done, Faild, Weight> {
    public commonUnit: CommonUnit<Params, Done, Faild>;
    public weight: Weight;
    constructor(commonUnit: CommonUnit<Params, Done, Faild>, weight: Weight) {
        this.commonUnit = commonUnit;
        this.weight = weight;
    }
}

export default CommonNode;
