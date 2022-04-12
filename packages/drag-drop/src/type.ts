export interface IDragItem {}

export type VECTOR = 1 | -1 | 0;

export interface IDragData {
    source: IPoint;
    offset: IPoint;
    vector: IPoint;
    dropOut?: boolean;
}

export interface IDropData<I extends IDragItem> {
    item: I | null;
    clientPosition: IPoint;
}

export interface IPoint {
    x: number;
    y: number;
}
