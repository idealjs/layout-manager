export type VECTOR = 1 | -1 | 0;

export interface IDragData {
    source: IPoint;
    offset: IPoint;
    vector: IPoint;
}

export interface IDropData {
    item: any;
    clientPosition: IPoint;
}

export interface IPoint {
    x: number;
    y: number;
}
