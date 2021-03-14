import { IPoint, VECTOR } from "./type";

function vectorFromEvent(event: MouseEvent, prevPoint: IPoint | null) {
    return {
        x: (prevPoint?.x != null
            ? Math.sign(prevPoint?.x - event.screenX)
            : 0) as VECTOR,
        y: (prevPoint?.y != null
            ? Math.sign(prevPoint?.y - event.screenY)
            : 0) as VECTOR,
    };
}

export default vectorFromEvent;
