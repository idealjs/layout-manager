import { UNIT_TYPE } from "../creator/createUnit";
import CommonNode from "./CommonNode";
import { IUnit } from "./CommonUnit";

enum SEARCH_STATUS {
    DOING,
    DONE,
}

class CommonGraph {
    public adjacency: Readonly<
        Map<IUnit<any[], any, any>, Array<CommonNode<any>>>
    > = new Map();

    constructor() {
        this.addEdge = this.addEdge.bind(this);
        this.removeEdge = this.removeEdge.bind(this);
        this.dfs = this.dfs.bind(this);
        this.storeHasCircle = this.storeHasCircle.bind(this);
    }

    public addEdge<To>(unit: IUnit<any[], any, any>, to?: CommonNode<To>) {
        this.adjacency.set(
            unit,
            to == null
                ? this.adjacency.get(unit) ?? []
                : (this.adjacency.get(unit) ?? []).concat(to)
        );
    }

    public removeEdge(
        unit: IUnit<any[], any, any>,
        to: IUnit<any[], any, any>
    ) {
        this.adjacency.set(
            unit,
            (this.adjacency.get(unit) ?? []).filter(
                (node) => node.commonUnit !== to
            )
        );
    }

    private dfs(
        unit: IUnit<any[], any, any>,
        search: (unit: IUnit<any[], any, any>) => void,
        done: (unit: IUnit<any[], any, any>) => void
    ) {
        search(unit);
        this.adjacency.get(unit)?.forEach((node) => {
            this.dfs(node.commonUnit, search, done);
        });
        done(unit);
    }

    public storeHasCircle() {
        try {
            const searchStatus = new WeakMap<
                IUnit<any[], any, any>,
                SEARCH_STATUS
            >();
            let searchStack: IUnit<any[], any, any>[] = [];
            const searchStoreUnit = (unit: IUnit<any[], any, any>) => {
                searchStack.push(unit);
                if (unit.unitOptions.type !== UNIT_TYPE.STORE) {
                    searchStatus.set(unit, SEARCH_STATUS.DONE);
                    return;
                }
                // if has visist;
                if (searchStatus.get(unit) === SEARCH_STATUS.DOING) {
                    throw new Error(
                        `Circular dependency detected on unit ${unit}`
                    );
                }

                if (searchStatus.get(unit) === SEARCH_STATUS.DONE) {
                    return;
                }

                searchStatus.set(unit, SEARCH_STATUS.DOING);

                const deps = this.adjacency.get(unit);
                if (deps === null || deps?.length === 0) {
                    searchStatus.set(unit, SEARCH_STATUS.DONE);
                    return;
                }
            };

            this.adjacency.forEach((nodes, node, map) => {
                this.dfs(node, searchStoreUnit, (node) => {
                    searchStatus.set(node, SEARCH_STATUS.DONE);
                });
                searchStack = [];
            });
            return false;
        } catch (error) {
            console.error(error);
            return true;
        }
    }
}

export default CommonGraph;
