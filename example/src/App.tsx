import {
    CMPTFactory,
    GrapeLayout,
    LAYOUT_DIRECTION,
    LayoutNode,
    LayoutNodeActionType,
    MASK_PART,
    PanelNode,
    ROOTID,
} from "@idealjs/grape-layout";
import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";

import Layout from "./components/Layout";
import Counter, { CounterProvider } from "./Counter";

const ROOT = new LayoutNode({
    layoutJSON: {
        direction: LAYOUT_DIRECTION.ROOT,
    },
});
ROOT.id = ROOTID;

const N = new LayoutNode({
    layoutJSON: {
        direction: LAYOUT_DIRECTION.COL,
    },
});
N.id = "mainN";

const N_A = new LayoutNode({ layoutJSON: { direction: LAYOUT_DIRECTION.TAB } });
N_A.id = "N_A";

const N_B = new LayoutNode({ layoutJSON: { direction: LAYOUT_DIRECTION.ROW } });
N_B.id = "N_B";

const N_B_A = new LayoutNode({
    layoutJSON: { direction: LAYOUT_DIRECTION.TAB },
});
N_B_A.id = "N_B_A";

const N_B_B = new LayoutNode({
    layoutJSON: {
        direction: LAYOUT_DIRECTION.TAB,
    },
});
N_B_B.id = "N_B_B";

ROOT.appendLayoutNode(N);

N.appendLayoutNode(N_A).appendLayoutNode(N_B);
N_B.appendLayoutNode(N_B_A).appendLayoutNode(N_B_B);

const P_A_A = new PanelNode({
    panelJSON: {
        id: "P_A_A",
        page: "test2",
    },
});

const P_A_B = new PanelNode({
    panelJSON: {
        id: "P_A_B",
        page: "test",
    },
});

N_A.appendPanelNode(P_A_A, P_A_B);

const P_B_A_A = new PanelNode({
    panelJSON: {
        id: "P_B_A_A",
        page: "test4",
    },
});

const P_B_A_B = new PanelNode({
    panelJSON: {
        id: "P_B_A_B",
        page: "test",
        data: "abc",
    },
});

N_B_A.appendPanelNode(P_B_A_A, P_B_A_B);

const P_B_B_A = new PanelNode({
    panelJSON: {
        id: "P_B_B_A",
        page: "test3",
    },
});

const P_B_B_B = new PanelNode({
    panelJSON: {
        id: "P_B_B_B",
        page: "test",
    },
});

N_B_B.appendPanelNode(P_B_B_A, P_B_B_B);

const rules = [
    { part: MASK_PART.BOTTOM, max: 2 },
    { part: MASK_PART.RIGHT, max: 2 },
    { part: MASK_PART.TOP, max: 3, limitLevel: 1 },
    { part: MASK_PART.CENTER, max: 3 },
];

const factory: CMPTFactory = (page: string) => {
    switch (page) {
        case "test":
            return (props) => {
                const { nodeData } = props;
                const [counter, setCounter] = useState(0);
                const [radom] = useState(Math.random());
                useEffect(() => {
                    const handler = setInterval(() => {
                        setCounter((c) => c + 1);
                    }, 1000);
                    return () => {
                        clearInterval(handler);
                    };
                }, []);
                return (
                    <div>
                        {nodeData}:{counter}---{radom}
                    </div>
                );
            };
        case "test2":
            return (props) => {
                const { nodeData } = props;
                const [counter, setCounter] = useState(0);
                useEffect(() => {
                    const handler = setInterval(() => {
                        setCounter((c) => c + 1);
                    }, 1000);
                    return () => {
                        clearInterval(handler);
                    };
                }, []);

                const onClick = useCallback(async () => {
                    try {
                        const target = ROOT.findNodeByRules(rules);
                        console.debug("[Debug] target is", target);
                        if (target) {
                            const test = new PanelNode({
                                panelJSON: {
                                    id: nanoid(),
                                    page: "test",
                                },
                            });
                            ROOT.doAction(LayoutNodeActionType.ADD_PANEL, {
                                panelNode: test,
                                mask: target.rule.part,
                                target: target.layoutNode,
                            });
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }, []);

                const onShow = useCallback(() => {
                    console.log(JSON.stringify(ROOT.toJSON(), null, 2));
                }, []);

                return (
                    <div>
                        <button onClick={onClick}>add panel</button>
                        <button onClick={onShow}>show layout obj</button>

                        {nodeData}
                        {counter}
                    </div>
                );
            };
        case "test3":
            return (props) => {
                return <Counter />;
            };
        case "test4":
            return (props) => {
                return (
                    <div>
                        <div>with new scope</div>
                        <CounterProvider>
                            <Counter />
                        </CounterProvider>
                    </div>
                );
            };
        default:
            return () => {
                return <div>page {page} not found</div>;
            };
    }
};

function App() {
    return (
        <div className="App" style={{ height: "100vh", width: "100vw" }}>
            <GrapeLayout factory={factory} layout={ROOT}>
                <Layout />
            </GrapeLayout>
        </div>
    );
}

export default App;
