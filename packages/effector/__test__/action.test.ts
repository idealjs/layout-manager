import createUnit, { updateSymbol } from "../src/creator/createUnit";

describe("event test", () => {
    test("should be triggered", (done) => {
        const $action = createUnit<[number], number>((p) => p);
        const listener = jest.fn((state: number) => {
            expect(state).toBe(1);
            done();
        });
        $action.slot.addListener(updateSymbol, listener);
        $action(1);
    });
});
