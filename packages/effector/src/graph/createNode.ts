import { IUnit } from "../creator/createUnit";

export interface INode<Weight> {
    unit: IUnit<any[], any, any, any>;
    weight: Weight;
}

function createNode<Weight>(
    unit: IUnit<any[], any, any, any>,
    weight: Weight
): INode<Weight>;

function createNode(unit: IUnit<any, any, any, any>): INode<unknown>;

function createNode<Weight>(unit: IUnit<any, any, any, any>, weight?: Weight) {
    return {
        unit,
        weight,
    };
}

export default createNode;
