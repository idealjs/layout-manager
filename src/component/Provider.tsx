import { AnyAction, EntityState } from "@reduxjs/toolkit";
import React, {
    createContext,
    FC,
    FunctionComponent,
    useContext,
    useEffect,
    useReducer,
} from "react";

import reducer, { adapter, INode, setAll, TABCMPT } from "../reducer/nodes";

const context = createContext<
    [EntityState<INode>, React.Dispatch<AnyAction>] | null
>(null);

type CMPTFactory = (page: string) => FunctionComponent<{}> | void;

const CMPTContext = createContext<CMPTFactory | null>(null);

const Provider: FC<{ value: INode[]; factory: CMPTFactory; Tab?: TABCMPT }> = (
    props
) => {
    const { value, children, factory } = props;
    const [state, dispatch] = useReducer(reducer, adapter.getInitialState());

    useEffect(() => {
        dispatch(setAll(value));
    }, [value]);
    return (
        <CMPTContext.Provider value={factory}>
            <context.Provider value={[state, dispatch]}>
                {children}
            </context.Provider>
        </CMPTContext.Provider>
    );
};

export const useNode = () => {
    const content = useContext(context);
    if (content == null) {
        throw new Error("Node Context not Provide");
    }
    return content;
};

export const useFactory = () => {
    const factory = useContext(CMPTContext);
    if (factory == null) {
        throw new Error("Factory not Provide");
    }
    return factory;
};

export default Provider;
