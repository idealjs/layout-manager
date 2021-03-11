function offsetFromEvent(
    event: MouseEvent,
    source: { screenX: number; screenY: number } | null
) {
    // console.debug("[Info] offsetFromEvent event", event);
    // console.debug("[Info] offsetFromEvent source", source);
    return {
        x: event.screenX - (source?.screenX != null ? source?.screenX : 0),
        y: event.screenY - (source?.screenY != null ? source?.screenY : 0),
    };
}

export default offsetFromEvent;
