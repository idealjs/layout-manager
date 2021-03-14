import { IPoint } from "./type";

function offsetFromEvent(event: MouseEvent, source: IPoint | null) {
    return {
        x: event.screenX - (source?.x != null ? source?.x : 0),
        y: event.screenY - (source?.y != null ? source?.y : 0),
    };
}

export default offsetFromEvent;
