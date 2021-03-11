import { ForwardRefExoticComponent, RefAttributes } from "react";

export interface ISplitterNode {
    id: string;
    height: number;
    width: number;
    left: number;
    top: number;

    primaryId: string;
    secondaryId: string;
    parentId: string;
}

export interface IWidgetNode {
    id: string;
    height: number;
    width: number;
    left: number;
    top: number;
    primaryOffset: number;
    secondaryOffset: number;
    children: string[];
}

export enum LAYOUT_DIRECTION {
    COL = "COL",
    ROW = "ROW",
    TAB = "TAB",
}

export interface ILayoutNode {
    id: string;
    height: number;
    width: number;
    left: number;
    top: number;
    primaryOffset: number;
    secondaryOffset: number;
    parentId: string;
    children: string[];
    direction: LAYOUT_DIRECTION | null;
}

export interface IPanelNode {
    id: string;
    parentId: string;
    page: string;
    selected: boolean;
    data?: any;
}

export type TABCMPT = ForwardRefExoticComponent<
    {
        nodeId: string;
        nodeTitle: string;
        onClose: () => void;
        onSelect: () => void;
    } & RefAttributes<HTMLDivElement>
>;
