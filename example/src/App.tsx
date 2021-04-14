import React, { useCallback, useEffect, useState } from "react";

import {
    Layout,
    Provider,
    CMPTFactory,
    LAYOUT_DIRECTION,
    LayoutNode,
    PanelNode,
    MASK_PART,
    ROOTID,
    useUpdate,
} from "@idealjs/layout-manager";
import Popout, { PopoutContext } from "./component/Popout";
import { Fragment } from "react";
import { uniqueId } from "lodash";

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
        page: "test",
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
        page: "test",
    },
});

const P_B_B_B = new PanelNode({
    panelJSON: {
        id: "P_B_B_B",
        page: "test",
    },
});

N_B_B.appendPanelNode(P_B_B_A, P_B_B_B);

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
                const update = useUpdate(ROOT);
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
                        const target = ROOT.findNodeByRules([
                            { part: MASK_PART.BOTTOM, max: 2 },
                            { part: MASK_PART.RIGHT, max: 2 },
                            { part: MASK_PART.TOP, max: 3, limitLevel: 1 },
                            { part: MASK_PART.CENTER, max: 2 },
                        ]);
                        if (target) {
                            const test = new PanelNode({
                                panelJSON: {
                                    id: uniqueId(),
                                    page: "test",
                                },
                            });

                            ROOT.addPanelNode(
                                test,
                                target.rule.part,
                                target.layoutNode
                            );
                            update();
                        }
                    } catch (error) {
                        console.error(error);
                    }
                }, [update]);

                return (
                    <div>
                        <button onClick={onClick}>test</button>
                        {nodeData}
                        {counter}
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
    const [portalState, setPortalState] = useState<string[]>([]);
    const onClick = useCallback(() => {
        setPortalState((s) => s.concat("b"));
    }, []);

    const onShow = useCallback(() => {
        console.log(ROOT.toJSON());
    }, []);

    return (
        <Fragment>
            <div className="App" style={{ height: 500, width: 500 }}>
                <button onClick={onClick}>open portal</button>
                <button onClick={onShow}>show layout obj</button>
                <Provider factory={factory}>
                    <Layout layoutNode={ROOT} />
                </Provider>
            </div>
            <PopoutContext.Provider value={portalState}>
                <Popout />
            </PopoutContext.Provider>
        </Fragment>
    );
}

export default App;
