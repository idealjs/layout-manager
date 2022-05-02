import createInternalEvent from "../src/creator/createInternalEvent";
import createStore from "../src/creator/createStore";

describe("graph test", () => {
    test("event shouldn't has circle", (done) => {
        const $event = createInternalEvent<number>();

        const listener = jest.fn((state: number) => {
            expect(state).toBe(1);
            done();
        });
        $event.on($event, listener);
        $event(1);
        expect($event.scope.graph.storeHasCircle()).toBe(false);
    });

    test("store should has circle", (done) => {
        const $store = createStore<number>(0);

        const listener = jest.fn((state: number, payload: number) => {
            return 1;
        });
        $store.on($store, listener);

        expect($store.unit.scope.graph.storeHasCircle()).toBe(true);
        done();
    });
});
