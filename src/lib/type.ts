import { MASK_PART } from "../enum";
import { LAYOUT_DIRECTION } from "../reducer/type";

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
