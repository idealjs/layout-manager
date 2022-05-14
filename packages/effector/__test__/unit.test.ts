import createUnit, { updateSymbol } from "../src/creator/createUnit";

describe("unit test", () => {
    test("should be triggered", (done) => {
        const $unit = createUnit<[number], number>((p) => p);
        const listener = jest.fn((state: number) => {
            try {
                expect(state).toBe(1);
                done();
            } catch (error) {
                done(error);
            }
        });
        $unit.slot.addListener(updateSymbol, listener);
        $unit(1);
    });
});
