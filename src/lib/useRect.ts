import { useCallback, useMemo, useState } from "react";

const useRect = (): [
    (el: HTMLElement | null) => void,
    {
        height: number;
        width: number;
    }
] => {
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    const ref = useCallback((el: HTMLElement | null) => {
        console.debug("[Info] set rect");
        setHeight(el?.getBoundingClientRect().height || 0);
        setWidth(el?.getBoundingClientRect().width || 0);
    }, []);

    const rect = useMemo(() => {
        return {
            height: height,
            width: width,
        };
    }, [height, width]);
    return [ref, rect];
};

export default useRect;
