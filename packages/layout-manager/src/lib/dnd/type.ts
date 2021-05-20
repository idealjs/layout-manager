export type VECTOR = 1 | -1 | 0;

export interface IDragData {
    source: IPoint;
    offset: IPoint;
    vector: IPoint;
}

interface IItem {}

export interface IDropData<I extends IItem> {
    item: I | null;
    clientPosition: IPoint;
}

export interface IPoint {
    x: number;
    y: number;
}
