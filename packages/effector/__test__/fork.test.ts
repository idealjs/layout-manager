import createEvent from "../src/creator/createEvent";
import createStore from "../src/creator/createStore";
import createUnit, { updateSymbol } from "../src/creator/createUnit";
import fork from "../src/fork";

describe("fork test", () => {
    test("should be triggered", (done) => {
        const $unit = createUnit<[number], number>((p) => p);
        const listener = jest.fn((state: number) => {
            try {
                expect(state).toBe(10);
                done();
            } catch (error) {
                done(error);
            }
        });

        const scope = fork();

        const $newUnit = scope.getUnit($unit.slot.id);
        $newUnit?.slot.addListener(updateSymbol, listener);

        $newUnit && $newUnit.runUnit(10);
    });
    test("should store change add", (done) => {
        const $counter = createStore(1, {
            id: "counter",
        });

        const $add = createEvent<number>({
            id: "add",
        });

        $counter.on($add, (state, payload) => {
            return state + payload;
        });

        const listener = jest.fn((state: number) => {
            try {
                expect(state).toBe(11);
                done();
            } catch (error) {
                done(error);
            }
        });

        const scope = fork();

        const $newUnit = scope.getUnit($add.slot.id);

        const $newCounter = scope.getUnit($counter.unit.slot.id);

        $newCounter?.slot.addListener(updateSymbol, listener);

        if ($newUnit) {
            $newUnit.runUnit(10);
        }
    });
});