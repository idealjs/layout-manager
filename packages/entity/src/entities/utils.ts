import type { Middleware } from "redux";

import type { EntityId, EntityState, IdSelector, Update } from "./models";

export function selectIdValue<T>(entity: T, selectId: IdSelector<T>) {
    const key = selectId(entity);

    if (process.env.NODE_ENV !== "production" && key === undefined) {
        console.warn(
            "The entity passed to the `selectId` implementation returned undefined.",
            "You should probably provide your own `selectId` implementation.",
            "The entity that was passed:",
            entity,
            "The `selectId` implementation:",
            selectId.toString()
        );
    }

    return key;
}

export function ensureEntitiesArray<T>(
    entities: readonly T[] | Record<EntityId, T>
): readonly T[] {
    if (!Array.isArray(entities)) {
        entities = Object.values(entities);
    }

    return entities;
}

export function splitAddedUpdatedEntities<T>(
    newEntities: readonly T[] | Record<EntityId, T>,
    selectId: IdSelector<T>,
    state: EntityState<T>
): [T[], Update<T>[]] {
    newEntities = ensureEntitiesArray(newEntities);

    const added: T[] = [];
    const updated: Update<T>[] = [];

    for (const entity of newEntities) {
        const id = selectIdValue(entity, selectId);
        if (id in state.entities) {
            updated.push({ id, changes: entity });
        } else {
            added.push(entity);
        }
    }
    return [added, updated];
}

export function getTimeMeasureUtils(maxDelay: number, fnName: string) {
    let elapsed = 0;
    return {
        measureTime<T>(fn: () => T): T {
            const started = Date.now();
            try {
                return fn();
            } finally {
                const finished = Date.now();
                elapsed += finished - started;
            }
        },
        warnIfExceeded() {
            if (elapsed > maxDelay) {
                console.warn(`${fnName} took ${elapsed}ms, which is more than the warning threshold of ${maxDelay}ms. 
If your state or actions are very large, you may want to disable the middleware as it might cause too much of a slowdown in development mode. See https://redux-toolkit.js.org/api/getDefaultMiddleware for instructions.
It is disabled in production builds, so you don't need to worry about that.`);
            }
        },
    };
}

/**
 * @public
 */
export class MiddlewareArray<
    Middlewares extends Middleware<any, any>[]
> extends Array<Middlewares[number]> {
    constructor(...items: Middlewares);
    constructor(...args: any[]) {
        super(...args);
        Object.setPrototypeOf(this, MiddlewareArray.prototype);
    }

    static get [Symbol.species]() {
        return MiddlewareArray as any;
    }

    concat<AdditionalMiddlewares extends ReadonlyArray<Middleware<any, any>>>(
        items: AdditionalMiddlewares
    ): MiddlewareArray<[...Middlewares, ...AdditionalMiddlewares]>;

    concat<AdditionalMiddlewares extends ReadonlyArray<Middleware<any, any>>>(
        ...items: AdditionalMiddlewares
    ): MiddlewareArray<[...Middlewares, ...AdditionalMiddlewares]>;
    concat(...arr: any[]) {
        return super.concat.apply(this, arr);
    }

    prepend<AdditionalMiddlewares extends ReadonlyArray<Middleware<any, any>>>(
        items: AdditionalMiddlewares
    ): MiddlewareArray<[...AdditionalMiddlewares, ...Middlewares]>;

    prepend<AdditionalMiddlewares extends ReadonlyArray<Middleware<any, any>>>(
        ...items: AdditionalMiddlewares
    ): MiddlewareArray<[...AdditionalMiddlewares, ...Middlewares]>;

    prepend(...arr: any[]) {
        if (arr.length === 1 && Array.isArray(arr[0])) {
            return new MiddlewareArray(...arr[0].concat(this));
        }
        return new MiddlewareArray(...arr.concat(this));
    }
}