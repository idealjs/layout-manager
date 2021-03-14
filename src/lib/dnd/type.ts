export type VECTOR = 1 | -1 | 0;

export interface IDragData {
    offset: any;
    vector: any;
}

export interface IDropData {
    item: any;
    clientPosition: any;
}
