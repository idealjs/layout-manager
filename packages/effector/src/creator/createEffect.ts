import { IUnitOptions } from "../classes/CommonUnit";
import createEvent from "./createEvent";
import createStore from "./createStore";
import createUnit, {
    doneSymbol,
    Effect,
    faildSymbol,
    startSymbol,
} from "./createUnit";

const createEffect = <
    Params extends unknown[] = unknown[],
    Done = unknown,
    Faild = unknown
>(
    effect: Effect<Params, Done, Faild>,
    unitOptions?: Omit<IUnitOptions, "type">
) => {
    const effectUnit = createUnit(effect, unitOptions);
    const done = createEvent<Done>(unitOptions);
    const faild = createEvent<Faild>(unitOptions);
    const start = createEvent(unitOptions);
    const pending = createStore(true, unitOptions);

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
