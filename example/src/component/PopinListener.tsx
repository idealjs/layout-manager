import { useLayoutSymbol, useSlot } from "@idealjs/layout-manager";
import { useEffect } from "react";

const PopinListener = () => {
    const layoutSymbol = useLayoutSymbol();
    const slot = useSlot(layoutSymbol);

    useEffect(() => {
        slot.addListener("popin", (e) => {
            console.log(e);
        });
    }, [slot]);

    return null;
};

export default PopinListener;
