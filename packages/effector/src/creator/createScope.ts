import { Sns } from "@idealjs/sns";

import Graph from "../graph/Graph";

const createScope = () => {
    const sns = new Sns();
    const graph = new Graph();
    const createSlot = () => {
        return sns.setSlot(Symbol());
    };
    return {
        sns,
        graph,
        createSlot,
    };
};

export default createScope;

export type Scope = ReturnType<typeof createScope>;

export const defaultScope = createScope();
