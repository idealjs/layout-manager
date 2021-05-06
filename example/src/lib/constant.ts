import { MASK_PART } from "@idealjs/layout-manager";

export const rules = [
    { part: MASK_PART.BOTTOM, max: 2 },
    { part: MASK_PART.RIGHT, max: 2 },
    { part: MASK_PART.TOP, max: 3, limitLevel: 1 },
    { part: MASK_PART.CENTER, max: 2 },
]
