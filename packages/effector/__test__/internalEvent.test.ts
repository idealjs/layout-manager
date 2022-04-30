import createInternalEvent from "../src/creator/createInternalEvent";
import { updateSymbol } from "../src/creator/createUnit";

describe("internal event test", () => {
    test("should be triggered", (done) => {
        const $plus = createInternalEvent<number>();

        const listener = jest.fn((state: number) => {
            expect(state).toBe(1);
            done();
        });

        $plus.slot.addListener(updateSymbol, listener);

        $plus(1);
    });

    test("should trigger unit", (done) => {
        const $plus = createInternalEvent<number>();
        const $unit = createInternalEvent();

        const listener = jest.fn((state: number) => {
            expect(state).toBe(1);
            expect(listener).toBeCalledTimes(1);
            done();
        });

        $unit.on($plus, listener);
        $plus(1);
    });
});
