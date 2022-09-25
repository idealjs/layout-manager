function isHTMLElement(
    el: Element,
    window: Window & typeof globalThis
): el is HTMLElement {
    return el instanceof window.HTMLElement;
}

export default isHTMLElement;
