import { VECTOR } from "./type";

function vectorFromEvent(
    event: MouseEvent,
    prevPoint: { screenX: number; screenY: number } | null
) {
    return {
        x: (prevPoint?.screenX != null
            ? Math.sign(prevPoint?.screenX - event.screenX)
            : 0) as VECTOR,
        y: (prevPoint?.screenY != null
            ? Math.sign(prevPoint?.screenY - event.screenY)
            : 0) as VECTOR,
    };
}

export default vectorFromEvent;
