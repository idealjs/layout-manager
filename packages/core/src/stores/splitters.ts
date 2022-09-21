import {
    createEvent,
    createStore,
    useStore,
    useStoreMap,
} from "@idealjs/effector";

import { ISplitterNode } from "../type";

const $splitters = createStore<ISplitterNode[]>([]);

export const $setAllSplitters = createEvent<ISplitterNode[]>();

$splitters.on($setAllSplitters, (_, splitters) => splitters);

export default $splitters;

export const useSplitters = () => {
    return useStore($splitters);
};

export const useSplitter = (nodeId: string) => {
    const splitter = useStoreMap($splitters, (splitters) =>
        splitters.find((splitter) => splitter.id === nodeId)
    );
    return splitter;
};
