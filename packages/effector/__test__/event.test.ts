import createEvent from "../src/creator/createEvent";
import { updateSymbol } from "../src/creator/createUnit";

describe("internal event test", () => {
    test("should be triggered", (done) => {
        const $plus = createEvent<number>();

        const listener = jest.fn((state: number) => {
            expect(state).toBe(1);
            done();
        });

        $plus.slot.addListener(updateSymbol, listener);

        $plus(1);
    });

    test("should trigger unit", (done) => {
        const $plus = createEvent<number>();
        const $unit = createEvent();

        const listener = jest.fn((state: number) => {
            expect(state).toBe(1);
            expect(listener).toBeCalledTimes(1);
            done();
        });

        $unit.on($plus, listener);
        $plus(1);
    });
});
