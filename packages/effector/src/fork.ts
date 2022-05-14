import CommonScope, { defaultScope } from "./classes/CommonScope";
import createScope from "./creator/createScope";
import { UNIT_TYPE } from "./creator/createUnit";

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
            let toUnit = newScope.getUnit(node.commonUnit.slot.id);
            if (!toUnit) {
                toUnit = node.commonUnit.fork(newScope);
            }

            if (forkUnit?.unitOptions.type === UNIT_TYPE.STORE) {
                const store = newScope.getStore(forkUnit.slot.id);
                if (store) {
                    store.on(toUnit, node.weight);
                    return;
                } else {
                    throw new Error(
                        `${store} is empty.${forkUnit.slot.id.toString()} not found`
                    );
                }
            }

            forkUnit?.on(toUnit, node.weight);
        });
    });

    return newScope;
};

export default fork;
