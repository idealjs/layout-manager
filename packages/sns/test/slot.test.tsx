import { act, renderHook } from "@testing-library/react-hooks";
import { FC, StrictMode, useCallback, useState } from "react";
import SnsProvider, { useSetSlot, useSlot, useSns } from "src/SnsProvider";

describe("useSlot useSetSlot StrictMode", () => {
    test("should has one slot", () => {
        const wrapper: FC = (props) => {
            const { children } = props;
            return (
                <StrictMode>
                    <SnsProvider>{children}</SnsProvider>
                </StrictMode>
            );
        };
        const { result } = renderHook(
            () => {
                const [testId] = useState(Symbol("A"));
                const slot = useSetSlot(testId);
                const sns = useSns();
                return { slot, sns };
            },
            {
                wrapper,
            }
        );
        // @ts-ignore
        expect(result.current.sns.slots.length).toBe(1);
    });

    test("should has one slot after changeTestId", () => {
        const wrapper: FC = (props) => {
            const { children } = props;
            return (
                <StrictMode>
                    <SnsProvider>{children}</SnsProvider>
                </StrictMode>
            );
        };
        const { result } = renderHook(
            () => {
                const [testId, setTestId] = useState(Symbol("A"));
                const slot = useSetSlot(testId);
                const sns = useSns();
                const changeTestId = useCallback(() => {
                    setTestId(Symbol("B"));
                }, []);

                return { slot, sns, changeTestId };
            },
            {
                wrapper,
            }
        );
        act(() => {
            result.current.changeTestId();
        });
        // @ts-ignore
        expect(result.current.sns.slots.length).toBe(1);
    });

    test("should has one slot if id is same", () => {
        const wrapper: FC = (props) => {
            const { children } = props;
            return (
                <StrictMode>
                    <SnsProvider>{children}</SnsProvider>
                </StrictMode>
            );
        };
        const { result } = renderHook(
            () => {
                const [testId] = useState("A");
                const slot = useSetSlot(testId);
                const sns = useSns();
                return { slot, sns };
            },
            {
                wrapper,
            }
        );

        const { result: result2 } = renderHook(
            () => {
                const [testId] = useState("A");
                const slot = useSlot(testId);
                const sns = useSns();
                return { slot, sns };
            },
            {
                wrapper,
            }
        );

        // @ts-ignore
        expect(result.current.sns.slots.length).toBe(1);
        // @ts-ignore
        expect(result2.current.sns.slots.length).toBe(1);
        // @ts-ignore
        expect(result.current.sns.slots[0]).toEqual(
            // @ts-ignore
            result2.current.sns.slots[0]
        );
    });
});
