import { updateSymbol } from "../src/creator/createAction";
import createEffect from "../src/creator/createEffect";

jest.useFakeTimers();

describe("event test", () => {
    test("should change state", (done) => {
        const mockFn = jest.fn((timer: number): Promise<number> => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    console.log("test test");
                    resolve(100);
                }, timer);
            });
        });

        const fx = createEffect(mockFn);

        const listener = jest.fn((payload) => {
            expect(payload).toBe(100);
            done();
        });

        fx.done.slot.addListener(updateSymbol, listener);

        fx(1000);
        jest.runAllTimers();
    });
});
