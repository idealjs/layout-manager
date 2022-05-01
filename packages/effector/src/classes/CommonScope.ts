import { Sns } from "@idealjs/sns";

import CommonGraph from "./CommonGraph";
import CommonStore from "./CommonStore";
import CommonUnit from "./CommonUnit";

class CommonScope {
    public sns = new Sns();
    public graph = new CommonGraph();
    private unitMaps = new Map<
        string | number | symbol,
        CommonUnit<any[], any, any>
    >();

    private storeMaps = new Map<string | number | symbol, CommonStore<any>>();

    constructor() {
        this.createSlot = this.createSlot.bind(this);
        this.hasUnit = this.hasUnit.bind(this);
        this.getUnit = this.getUnit.bind(this);
        this.setUnit = this.setUnit.bind(this);
        this.getUnits = this.getUnits.bind(this);
        this.hasStore = this.hasStore.bind(this);
        this.getStore = this.getStore.bind(this);
        this.setStore = this.setStore.bind(this);
        this.getStores = this.getStores.bind(this);
    }

    public createSlot(unitId: string | number | symbol = Symbol()) {
        const slot = this.sns.setSlot(unitId);
        return slot;
    }

    public hasUnit(key: string | number | symbol) {
        return this.unitMaps.has(key);
    }

    public getUnit(key: string | number | symbol) {
        return this.unitMaps.get(key);
    }

    public setUnit(
        key: string | number | symbol,
        unit: CommonUnit<any[], any, any>
    ) {
        return this.unitMaps.set(key, unit);
    }

    public getUnits(): CommonUnit<any[], any, any>[] {
        return Array.from(this.unitMaps.values());
    }

    public hasStore(key: string | number | symbol) {
        return this.storeMaps.has(key);
    }

    public getStore(key: string | number | symbol) {
        return this.storeMaps.get(key);
    }

    public setStore(key: string | number | symbol, store: CommonStore<any>) {
        console.log("test test setStore");
        return this.storeMaps.set(key, store);
    }

    public getStores(): CommonStore<any>[] {
        return Array.from(this.storeMaps.values());
    }
}

export default CommonScope;

export const defaultScope = new CommonScope();
