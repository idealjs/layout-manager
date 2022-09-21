import { createContext, PropsWithChildren, useContext, useRef } from "react";
import { proxy, useSnapshot } from "valtio";

const Counter = () => {
    const ctx = useCounterContext();
    const snap = useSnapshot(ctx);

    return (
        <div>
            {snap.count}
            <button
                onClick={() => {
                    ctx.count = snap.count + 10;
                }}
            >
                plus
            </button>
        </div>
    );
};

export default Counter;

const context = createContext<{
    count: number;
}>(proxy({ count: 0 }));

export const CounterProvider = (props: PropsWithChildren<{}>) => {
    const { children } = props;
    const state = useRef(proxy({ count: 0 })).current;
    return <context.Provider value={state}>{children}</context.Provider>;
};

const useCounterContext = () => {
    const ctx = useContext(context);
    return ctx;
};
