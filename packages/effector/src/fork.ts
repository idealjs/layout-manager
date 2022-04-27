import { Sns } from "@idealjs/sns";

import { defaultScope, Scope } from "./creator/createScope";
import Graph from "./graph/Graph";

const fork = (scope: Scope = defaultScope) => {
    if (scope.graph.hasCircle()) {
        throw new Error("Circular dependency detected");
    }
    const graph = new Graph();
    const sns = new Sns();

    scope.graph.adjacency.forEach((value, unit) => {});
};

export default fork;
