import {
    MutableRefObject,
    useCallback,
    useLayoutEffect,
    useMemo,
    useState,
} from "react";

const useRect = (
    ref: MutableRefObject<HTMLDivElement | null>
): [
    {
        height: number;
        width: number;
    }
] => {
    const [height, setHeight] = useState(0);
    const [width, setWidth] = useState(0);

    const setRect = useCallback(() => {
        requestAnimationFrame(() => {
            console.debug("[Info] set rect");
            if (
                height !== ref.current?.getBoundingClientRect().height ||
                width !== ref.current?.getBoundingClientRect().width
            ) {
                setHeight(ref.current?.getBoundingClientRect().height || 0);
                setWidth(ref.current?.getBoundingClientRect().width || 0);
            }
        });
    }, [height, ref, width]);

    useLayoutEffect(() => {
        requestAnimationFrame(setRect);
    }, [ref, setRect]);

    const rect = useMemo(() => {
        return {
            height: height,
            width: width,
        };
    }, [height, width]);

    return [rect];
};

export default useRect;
