import { updateSymbol } from "../src/creator/createAction";
import createEvent from "../src/creator/createEvent";

describe("event test", () => {
    test("should be triggered", (done) => {
        const $plus = createEvent<number>();

        const listener = jest.fn((state: number) => {
            expect(state).toBe(1);
            done();
        });

        $plus.slot.addListener(updateSymbol, listener);

        $plus(1);
    });

    test("should trigger event", (done) => {
        const $plus = createEvent<number>();
        const $event = createEvent();

        const listener = jest.fn((state: number) => {
            expect(state).toBe(1);
            expect(listener).toBeCalledTimes(1);
            done();
        });

        $event.on($plus, listener);
        $plus(1);
    });
});
