import { MASK_PART } from "../enum";
import { LAYOUT_DIRECTION } from "../reducer/type";
import LayoutNode from "./LayoutNode";
import PanelNode from "./PanelNode";

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
