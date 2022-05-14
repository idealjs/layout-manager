import CommonScope from "../src/classes/CommonScope";
import createEffect from "../src/creator/createEffect";
import createEvent from "../src/creator/createEvent";
import createStore from "../src/creator/createStore";
import { updateSymbol } from "../src/creator/createUnit";

jest.useFakeTimers();

let scope: CommonScope;

beforeEach(() => {
    scope = new CommonScope();
});

describe("store test", () => {
    test("should change by event", (done) => {
        const $counter = createStore(1, {
            scope,
            id: "counter",
        });

        const $add = createEvent<number>({
            scope,
            id: "add",
        });

        $counter.on($add, (state, payload) => {
            return state + payload;
        });

        const listener = jest.fn((state: number) => {
            try {
                expect(listener).toBeCalledTimes(1);
                expect(state).toBe(2);
                done();
            } catch (error) {
                done(error);
            }
        });

        $counter.subscribe(listener);

        $add(1);
    });

    test("should change by effect", (done) => {
        let count = "0";
        const mockFn = jest.fn((timer: number): Promise<string> => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve("100");
                }, timer);
            });
        });

        const store = createStore("0", {
            scope,
        });
        const fx = createEffect(mockFn, { scope });
        store.on(fx.done, (state, payload) => {
            return state + payload;
        });

        const listener = jest.fn((state: string) => {
            try {
                count = state;
                expect(listener).toBeCalledTimes(1);
                expect(count).toBe("0100");
                done();
            } catch (error) {
                done(error);
            }
        });

        store.subscribe(listener);
        fx(1000);
        jest.runAllTimers();
    });

    test("should store change add sub", (done) => {
        const $counter = createStore(1, {
            scope,
            id: "counter",
        });

        const $add = createEvent<number>({
            scope,
            id: "add",
        });

        const $sub = createEvent<number>({
            scope,
            id: "sub",
        });

        $counter.on($add, (state, payload) => {
            return state + payload;
        });

        $counter.on($sub, (state, payload) => {
            return state - payload;
        });

        const listener = jest.fn((state: number) => {
            try {
                expect(state).toBe(11);
                done();
            } catch (error) {
                done(error);
            }
        });

        $counter?.unit.slot.addListener(updateSymbol, listener);

        $add.runUnit(10);
    });
});
