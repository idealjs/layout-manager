import {
    MutableRefObject,
    useCallback,
    useLayoutEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import useMountedRef from "./useMountedRef";

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
    const requestRef = useRef<number>();
    const { mountedRef } = useMountedRef();

    const setRect = useCallback(() => {
        if (
            height !== ref.current?.getBoundingClientRect().height ||
            width !== ref.current?.getBoundingClientRect().width
        ) {
            if (mountedRef.current === true) {
                setHeight(ref.current?.getBoundingClientRect().height || 0);
                setWidth(ref.current?.getBoundingClientRect().width || 0);
            }
        }
        requestRef.current = requestAnimationFrame(setRect);
    }, [height, mountedRef, ref, width]);

    useLayoutEffect(() => {
        requestRef.current = requestAnimationFrame(setRect);
        return () => {
            if (requestRef.current != null) {
                cancelAnimationFrame(requestRef.current);
            }
        };
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
