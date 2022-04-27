import { IUnit } from "../creator/createAction";
import { INode } from "./createNode";

enum SEARCH_STATUS {
    DOING,
    DONE,
}

class Graph {
    public adjacency: Readonly<Map<IUnit, INode<any>[]>> = new Map();

    public addEdge<To>(unit: IUnit, to?: INode<To>) {
        this.adjacency.set(
            unit,
            to == null
                ? this.adjacency.get(unit) ?? []
                : (this.adjacency.get(unit) ?? []).concat(to)
        );
    }

    public removeEdge(unit: IUnit, to: IUnit) {
        this.adjacency.set(
            unit,
            (this.adjacency.get(unit) ?? []).filter((node) => node.unit !== to)
        );
    }

    private dfs(
        unit: IUnit,
        search: (node: IUnit) => void,
        done: (node: IUnit) => void
    ) {
        search(unit);
        this.adjacency.get(unit)?.forEach((node) => {
            this.dfs(unit, search, done);
        });
        done(unit);
    }

    public hasCircle() {
        try {
            const searchStatus = new WeakMap<IUnit, SEARCH_STATUS>();
            let searchStack: IUnit[] = [];
            const search = (unit: IUnit) => {
                searchStack.push(unit);
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
                this.dfs(node, search, (node) => {
                    searchStatus.set(node, SEARCH_STATUS.DONE);
                });
                searchStack = [];
            });
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}

export default Graph;
