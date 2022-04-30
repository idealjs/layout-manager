import createEffect from "../src/creator/createEffect";
import { updateSymbol } from "../src/creator/createUnit";

jest.useFakeTimers();

describe("effect test", () => {
    test("should change state", (done) => {
        const mockFn = jest.fn((timer: number): Promise<number> => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
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
