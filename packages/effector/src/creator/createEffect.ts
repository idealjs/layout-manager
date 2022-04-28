import createEvent, { IEvent } from "./createEvent";
import createStore, { IStore } from "./createStore";
import createUnit, {
    doneSymbol,
    Effect,
    faildSymbol,
    startSymbol,
} from "./createUnit";

export interface IEffect<Params extends unknown[], Done, Faild> {
    (...params: Params): void;
    done: IEvent<Done>;
    faild: IEvent<Faild>;
    pending: IStore<boolean>;
}

const createEffect = <
    Params extends unknown[] = unknown[],
    Done = unknown,
    Faild = unknown
>(
    effect: Effect<Params, Done, Faild>
): IEffect<Params, Done, Faild> => {
    const effectUnit = createUnit(effect);
    const done = createEvent<Done>();
    const faild = createEvent<Faild>();
    const start = createEvent();
    const pending = createStore(true);

    done.on(effectUnit, doneSymbol, (payload) => {
        done(payload);
    });

    faild.on(effectUnit, faildSymbol, (payload) => {
        faild(payload);
    });

    start.on(effectUnit, startSymbol, () => {
        start();
    });

    pending
        .on(start, () => true)
        .on(done, () => false)
        .on(faild, () => false);

    return Object.assign(effectUnit, {
        done,
        faild,
        pending,
    });
};

export default createEffect;
