import { MASK_PART } from "../enum";

export interface IRule {
    part: MASK_PART;
    max: number;
    limitLevel?: number;
}
