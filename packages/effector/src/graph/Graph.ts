import { IUnit } from "../creator/createUnit";
import { INode } from "./createNode";

enum SEARCH_STATUS {
    DOING,
    DONE,
}

type Unit = IUnit<any, any, any, any>;

class Graph {
    public adjacency: Readonly<Map<Unit, INode<any>[]>> = new Map();

    public addEdge<To>(unit: Unit, to?: INode<To>) {
        this.adjacency.set(
            unit,
            to == null
                ? this.adjacency.get(unit) ?? []
                : (this.adjacency.get(unit) ?? []).concat(to)
        );
    }

    public removeEdge(unit: Unit, to: Unit) {
        this.adjacency.set(
            unit,
            (this.adjacency.get(unit) ?? []).filter((node) => node.unit !== to)
        );
    }

    private dfs(
        unit: Unit,
        search: (node: Unit) => void,
        done: (node: Unit) => void
    ) {
        search(unit);
        this.adjacency.get(unit)?.forEach((node) => {
            this.dfs(unit, search, done);
        });
        done(unit);
    }

    public hasCircle() {
        try {
            const searchStatus = new WeakMap<Unit, SEARCH_STATUS>();
            let searchStack: Unit[] = [];
            const search = (unit: Unit) => {
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
