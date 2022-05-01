import CommonScope, { defaultScope } from "./classes/CommonScope";
import createScope from "./creator/createScope";

const fork = (scope: CommonScope = defaultScope) => {
    if (scope.graph.storeHasCircle()) {
        throw new Error("Circular dependency detected");
    }

    const newScope = createScope();
    scope.getStores().forEach((store) => {
        store.fork(newScope);
    });
    scope.getUnits().forEach((unit) => {
        let forkUnit = newScope.getUnit(unit.slot.id);

        if (!forkUnit) {
            forkUnit = unit.fork(newScope);
        }
        scope.graph.adjacency.get(unit)?.forEach((node) => {
            let unit = newScope.getUnit(node.commonUnit.slot.id);
            if (!unit) {
                unit = node.commonUnit.fork(newScope);
            }
            forkUnit?.on(unit, node.weight);
        });
    });

    return newScope;
};

export default fork;
