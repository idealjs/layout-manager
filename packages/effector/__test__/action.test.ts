import createAction, { updateSymbol } from "../src/creator/createAction";

describe("event test", () => {
    test("should be triggered", (done) => {
        const $action = createAction<[number], number>((p) => p);
        const listener = jest.fn((state: number) => {
            expect(state).toBe(1);
            done();
        });
        $action.slot.addListener(updateSymbol, listener);
        $action(1);
    });
});
