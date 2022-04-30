import { Sns } from "@idealjs/sns";

import Graph from "../graph/Graph";
import { IUnit } from "./createUnit";

export type Unit = IUnit<any, any, any, any>;

const createScope = () => {
    const sns = new Sns();
    const graph = new Graph();
    const unitMaps = new Map<string | number | symbol, Unit>();

    const createSlot = (unitId: string | number | symbol = Symbol()) => {
        const slot = sns.setSlot(unitId);
        return slot;
    };

    const hasUnit = (key: string | number | symbol) => {
        return unitMaps.has(key);
    };

    const getUnit = (key: string | number | symbol) => {
        return unitMaps.get(key);
    };

    const setUnit = (key: string | number | symbol, unit: Unit) => {
        return unitMaps.set(key, unit);
    };

    const getUnits = (): Unit[] => {
        return Array.from(unitMaps.values());
    };

    return {
        sns,
        graph,
        hasUnit,
        getUnit,
        setUnit,
        getUnits,
        createSlot,
    };
};

export default createScope;

export type Scope = ReturnType<typeof createScope>;

export const defaultScope = createScope();
