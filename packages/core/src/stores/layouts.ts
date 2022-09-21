import {
    createEvent,
    createStore,
    useStore,
    useStoreMap,
} from "@idealjs/effector";

import { ILayoutNode } from "../type";

const $layouts = createStore<ILayoutNode[]>([]);

export const $setAllLayouts = createEvent<ILayoutNode[]>();

$layouts.on($setAllLayouts, (_, layouts) => layouts);

export default $layouts;

export const useLayouts = (): ILayoutNode[] => {
    return useStore($layouts);
};

export const useLayout = (nodeId: string) => {
    return useStoreMap($layouts, (layouts) =>
        layouts.find((layout) => layout.id === nodeId)
    );
};
