import createUnit, { updateSymbol } from "../src/creator/createUnit";
import fork from "../src/fork";

describe("fork test", () => {
    test("should be triggered", (done) => {
        const $unit = createUnit<[number], number>((p) => p);
        const listener = jest.fn((state: number) => {
            expect(state).toBe(1);
            done();
        });

        const scope = fork();

        const $newUnit = scope.getUnit($unit.slot.id);
        $newUnit?.slot.addListener(updateSymbol, listener);

        $newUnit && $newUnit(1);
    });
});
