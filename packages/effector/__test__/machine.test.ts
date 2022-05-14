import CommonScope from "../src/classes/CommonScope";
import createEffect from "../src/creator/createEffect";
import createEvent from "../src/creator/createEvent";
import createMachine from "../src/creator/createMachine";

jest.useFakeTimers();

let scope: CommonScope;

beforeEach(() => {
    scope = new CommonScope();
});

describe("machine test", () => {
    test("should change by event", (done) => {
        const $machine = createMachine(0, {
            scope,
            id: "counter",
        });

        const $one = createEvent({
            scope,
            id: "one",
        });

        const $two = createEvent({
            scope,
            id: "two",
        });

        const $three = createEvent({
            scope,
            id: "three",
        });

        $machine.register($one, 1);

        $machine.register($two, 2);

        $machine.register($three, 3);

        const listener = jest.fn((state: number) => {
            try {
                expect(state).toBe(2);
                expect(listener).toBeCalledTimes(1);
                done();
            } catch (error) {
                done(error);
            }

            done();
        });

        $machine.subscribe(listener);

        $two();
    });

    test("should change by effect", (done) => {
        const mockFn = jest.fn((timer: number): Promise<string> => {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve("100");
                }, timer);
            });
        });

        const $machine = createMachine(0, {
            scope,
            id: "counter",
        });

        const $fx = createEffect(mockFn, {
            scope,
        });

        $machine.register($fx.done, 1);

        $machine.register($fx.faild, 2);

        const listener = jest.fn((state: number) => {
            try {
                expect(state).toBe(1);
                expect(listener).toBeCalledTimes(1);
                done();
            } catch (error) {
                done(error);
            }
        });

        $machine.subscribe(listener);

        $fx(1000);

        jest.runAllTimers();
    });
});
