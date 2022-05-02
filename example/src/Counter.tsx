import {
    createEvent,
    createStore,
    useEvent,
    useStore,
} from "@idealjs/effector";
import { UNIT_TYPE } from "@idealjs/effector/src/creator/createUnit";

const $counter = createStore(1, {
    id: "counter",
    type: UNIT_TYPE.STORE,
});

const $add = createEvent<number>({
    id: "add",
});

$counter.on($add, (state) => {
    console.log("test test on add", state);
    return state + 1;
});

const Counter = () => {
    const counter = useStore($counter);
    const add = useEvent($add);
    console.log("test test counter", counter);
    return (
        <div>
            {counter}
            <button
                onClick={() => {
                    add(10);
                }}
            >
                plus
            </button>
        </div>
    );
};
export default Counter;
