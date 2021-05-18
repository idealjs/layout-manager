import LayoutNode from "lib/LayoutNode";
import PanelNode from "lib/PanelNode";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { LAYOUT_DIRECTION, MASK_PART } from "src/enum";

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
    height: number;
    width: number;
    left: number;
    top: number;
    parentId: string;
    page: string;
    selected: boolean;
    data?: any;
}

export type TABCMPT = ForwardRefExoticComponent<
    {
        nodeId: string;
    } & RefAttributes<HTMLDivElement>
>;

export interface IRule {
    part: MASK_PART;
    max: number;
    limitLevel?: number;
}

export interface IPanelJSON {
    id: string;
    page: string;
    data?: any;
}

export interface ILayoutJSON {
    id: string;
    direction: LAYOUT_DIRECTION;
    primaryOffset: number;
    secondaryOffset: number;
    layouts: ILayoutJSON[];
    panels: IPanelJSON[];
}

export type ADD_PANEL_DATA = {
    panelNode: PanelNode,
    mask: MASK_PART,
    target: string | LayoutNode
}

export type MOVE_PANEL_DATA = {
    search: string;
    target: string;
    mask: MASK_PART;
}

export type MOVE_SPLITTER_DATA = {
    primary: string;
    secondary: string;
    offset: number;
}

export type REMOVE_PANEL_DATA = {
    search: string;
}

export type SELECT_TAB_DATA = {
    selected: string;
}
