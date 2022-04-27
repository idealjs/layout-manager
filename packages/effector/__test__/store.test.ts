import createEffect from "../src/creator/createEffect";
import Store from "../src/creator/Store";

jest.useFakeTimers();

describe("event test", () => {
    test("should change state", (done) => {
        let count = 0;
        const mockFn = jest.fn((timer: number): Promise<number> => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("test test");
                    resolve(100);
                }, timer);
            });
        });

        const store = new Store(0);
        const fx = createEffect(mockFn);
        store.on(fx.done, (state, payload) => {
            console.log("test test", state, payload);
            return state + payload;
        });

        const listener = jest.fn((state: number) => {
            count = state;
            expect(listener).toBeCalledTimes(1);
            expect(count).toBe(100);
            done();
        });
        store.subscribe(listener);
        fx(1000);
        jest.runAllTimers();
    });
});
