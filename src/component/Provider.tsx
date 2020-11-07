import { AnyAction, EntityState } from "@reduxjs/toolkit";
import React, { createContext, FC, useEffect, useReducer } from "react";

import reducer, { adapter, addMany, INode } from "../reducer/nodes";

export const context = createContext<
    [EntityState<INode>, React.Dispatch<AnyAction>] | null
>(null);

const Provider: FC<{ value: INode[] }> = (props) => {
    const { value, children } = props;
    const [state, dispatch] = useReducer(reducer, adapter.getInitialState());

    useEffect(() => {
        dispatch(addMany(value));
    }, [state, value]);
    return (
        <context.Provider value={[state, dispatch]}>
            {children}
        </context.Provider>
    );
};

export default Provider;
