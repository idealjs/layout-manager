import { useState } from "react";
import { useEffect } from "react";
import { FC } from "react";
import { createPortal } from "react-dom";

const Portal: FC = (props) => {
    const { children } = props;
    const [container] = useState(document.createElement("div"));
    useEffect(() => {
        container.style.height = "400px";
        container.style.width = "600px"
        const externalWindow = window.open(
            "",
            "",
            "width=600,height=400,left=200,top=200"
        );
        externalWindow?.document.body.appendChild(container);
        window.onbeforeunload = () => {
            externalWindow?.close();
        };
    }, [container]);

    return createPortal(children, container);
};

export default Portal;
