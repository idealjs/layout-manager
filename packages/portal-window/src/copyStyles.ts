const copyStyles = (source: Document, target: Document) => {
    // Store style tags, avoid reflow in the loop
    const fragment = target.createDocumentFragment();

    const styles = [...source.styleSheets].flatMap((sheet) => {
        if (sheet.href) {
            const link = target.createElement("link");
            link.rel = "stylesheet";
            link.href = sheet.href;
            return link;
        } else {
            const style = target.createElement("style");
            style.textContent = [...sheet.cssRules]
                .map((rule) => {
                    return rule.cssText;
                })
                .join("\n");

            return style;
        }
    });

    fragment.append(...styles);

    target.head.append(fragment);
};

export default copyStyles;
