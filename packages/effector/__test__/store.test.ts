import createEffect from "../src/creator/createEffect";
import createEvent from "../src/creator/createEvent";
import createStore from "../src/creator/createStore";

jest.useFakeTimers();

describe("store test", () => {
    test("should change by event", (done) => {
        const $counter = createStore(1, {
            id: "counter",
        });

        const $add = createEvent<number>({
            id: "add",
        });

        $counter.on($add, (state, payload) => {
            return state + payload;
        });

        const listener = jest.fn((state: number) => {
            expect(listener).toBeCalledTimes(1);
            expect(state).toBe(2);
            done();
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

        const store = createStore("0");
        const fx = createEffect(mockFn);
        store.on(fx.done, (state, payload) => {
            return state + payload;
        });

        const listener = jest.fn((state: string) => {
            count = state;
            expect(listener).toBeCalledTimes(1);
            expect(count).toBe("0100");
            done();
        });

        store.subscribe(listener);
        fx(1000);
        jest.runAllTimers();
    });
});
