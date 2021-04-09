import { LAYOUT_DIRECTION } from "../reducer/type";

export interface IRule {
    direction: Omit<LAYOUT_DIRECTION, LAYOUT_DIRECTION.ROOT>;
    max: number;
}
