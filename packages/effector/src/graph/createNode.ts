import { IUnit } from "../creator/createAction";

export interface INode<Weight> {
    unit: IUnit;
    weight: Weight;
}

function createNode<Weight>(unit: IUnit, weight: Weight): INode<Weight>;

function createNode(unit: IUnit): INode<unknown>;

function createNode<Weight>(unit: IUnit, weight?: Weight) {
    return {
        unit,
        weight,
    };
}

export default createNode;
