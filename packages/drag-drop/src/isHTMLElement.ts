function isHTMLElement(
    el: Element,
    window: Window & typeof globalThis
): el is HTMLElement {
    // return el instanceof window.HTMLElement;
    return true;
}

export default isHTMLElement;
