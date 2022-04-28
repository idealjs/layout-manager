import createUnit, { updateSymbol } from "../src/creator/createUnit";

describe("event test", () => {
    test("should be triggered", (done) => {
        const $unit = createUnit<[number], number>((p) => p);
        const listener = jest.fn((state: number) => {
            expect(state).toBe(1);
            done();
        });
        $unit.slot.addListener(updateSymbol, listener);
        $unit(1);
    });
});
