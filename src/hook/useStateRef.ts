import {
    Dispatch,
    MutableRefObject,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";

const useStateRef = <S>(
    initState: S
): [MutableRefObject<S>, S, Dispatch<SetStateAction<S>>] => {
    const stateContainer = useRef(initState);
    const [state, setState] = useState(initState);
    useEffect(() => {
        stateContainer.current = state;
    }, [state]);
    return [stateContainer, state, setState];
};

export default useStateRef;
