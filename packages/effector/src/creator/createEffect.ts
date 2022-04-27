import createAction, {
    doneSymbol,
    Effect,
    faildSymbol,
    startSymbol,
} from "./createAction";
import createEvent, { IEvent } from "./createEvent";
import createStore from "./createStore";
import Store from "./Store";

export interface IEffect<Params extends unknown[], Done, Faild> {
    (...params: Params): void;
    done: IEvent<[Done], Done, Faild>;
    faild: IEvent<[Faild], Faild, void>;
    pending: Store<boolean>;
}

const createEffect = <
    Params extends unknown[] = unknown[],
    Done = unknown,
    Faild = unknown
>(
    effect: Effect<Params, Done, Faild>
): IEffect<Params, Done, Faild> => {
    const effectAction = createAction(effect);
    const done = createEvent<Done>();
    const faild = createEvent<Faild>();
    const start = createEvent();
    const pending = createStore(true);

    done.on(effectAction, doneSymbol, (payload) => {
        done(payload);
    });

    faild.on(effectAction, faildSymbol, (payload) => {
        faild(payload);
    });

    start.on(effectAction, startSymbol, () => {
        start();
    });

    pending
        .on(start, () => true)
        .on(done, () => false)
        .on(faild, () => false);

    return Object.assign(effectAction, {
        done,
        faild,
        pending,
    });
};

export default createEffect;
