import { MASK_PART } from "../component/Widget";
import { LAYOUT_DIRECTION } from "../reducer/type";

const directionFromMask = (mask: MASK_PART): LAYOUT_DIRECTION => {
    switch (mask) {
        case MASK_PART.CENTER:
            return LAYOUT_DIRECTION.TAB;
        case MASK_PART.RIGHT:
            return LAYOUT_DIRECTION.ROW;
        case MASK_PART.LEFT:
            return LAYOUT_DIRECTION.ROW;
        case MASK_PART.TOP:
            return LAYOUT_DIRECTION.COL;
        case MASK_PART.BOTTOM:
            return LAYOUT_DIRECTION.COL;
        default:
            throw new Error("");
    }
};

export default directionFromMask;
