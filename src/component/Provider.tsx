import { AnyAction, EntityState } from "@reduxjs/toolkit";
import {
    createContext,
    FC,
    FunctionComponent,
    useContext,
    useEffect,
    useReducer,
} from "react";

import reducer, { adapter, INode, setAll, TABCMPT } from "../reducer/nodes";
import CustomTab from "./CustomTab";

const NodeContext = createContext<
    [EntityState<INode>, React.Dispatch<AnyAction>] | null
>(null);

export type CMPTFactory = (
    page: string
) => FunctionComponent<{ nodeData: any }>;

const CMPTContext = createContext<{
    factory: CMPTFactory;
    Tab: TABCMPT;
} | null>(null);

const RIDContext = createContext("RID");

const Provider: FC<{
    value: INode[];
    factory: CMPTFactory;
    Tab?: TABCMPT;
    RID?: string;
}> = (props) => {
    const { value, children, factory, Tab, RID } = props;
    const [state, dispatch] = useReducer(reducer, adapter.getInitialState());

    useEffect(() => {
        dispatch(setAll(value));
    }, [value]);

    return (
        <CMPTContext.Provider value={{ factory, Tab: Tab ? Tab : CustomTab }}>
            <NodeContext.Provider value={[state, dispatch]}>
                <RIDContext.Provider value={RID ? RID : "RID"}>
                    {children}
                </RIDContext.Provider>
            </NodeContext.Provider>
        </CMPTContext.Provider>
    );
};

export const useNode = () => {
    const content = useContext(NodeContext);
    if (content == null) {
        throw new Error("Node Context not Provide");
    }
    return content;
};

export const useFactory = (): CMPTFactory => {
    const content = useContext(CMPTContext);
    if (content == null) {
        throw new Error("CMPT Factory not Provide");
    }
    return content.factory;
};

export const useTab = (): TABCMPT => {
    const content = useContext(CMPTContext);
    if (content == null) {
        throw new Error("Tab CMPT not Provide");
    }
    return content.Tab;
};

export default Provider;
