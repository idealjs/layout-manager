import createScope, { defaultScope, Scope } from "./creator/createScope";

const fork = (scope: Scope = defaultScope) => {
    if (scope.graph.storeHasCircle()) {
        throw new Error("Circular dependency detected");
    }

    const newScope = createScope();
    scope.getUnits().forEach((unit) => {
        let forkUnit = newScope.getUnit(unit.slot.id);

        if (!forkUnit) {
            forkUnit = unit.fork(newScope);
        }
        scope.graph.adjacency.get(unit)?.forEach((node) => {
            let unit = newScope.getUnit(node.unit.slot.id);
            if (!unit) {
                unit = node.unit.fork(newScope);
            }
            forkUnit?.on(unit, node.weight);
        });
    });

    return newScope;
};

export default fork;
