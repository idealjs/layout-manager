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

const ROOT = new LayoutNode();
ROOT.id = ROOTID;
ROOT.direction = LAYOUT_DIRECTION.ROOT;

const N = new LayoutNode();
N.id = "mainN";
N.direction = LAYOUT_DIRECTION.COL;

const N_A = new LayoutNode();
N_A.direction = LAYOUT_DIRECTION.TAB;
N_A.id = "N_A";

const N_B = new LayoutNode();
N_B.direction = LAYOUT_DIRECTION.ROW;

const N_B_A = new LayoutNode();
N_B_A.direction = LAYOUT_DIRECTION.TAB;
N_B_A.id = "N_B_A";

const N_B_B = new LayoutNode();
N_B_B.direction = LAYOUT_DIRECTION.TAB;
N_B_B.id = "N_B_B";

ROOT.append(N);

N.append(N_A).append(N_B);
N_B.append(N_B_A).append(N_B_B);

const P_A_A = new PanelNode();
P_A_A.id = "P_A_A";
P_A_A.page = "test2";

const P_A_B = new PanelNode();
P_A_B.id = "P_A_B";
P_A_B.page = "test";

N_A.appendPanelNode(P_A_A, P_A_B);

const P_B_A_A = new PanelNode();
P_B_A_A.id = "P_B_A_A";
P_B_A_A.page = "test";

const P_B_A_B = new PanelNode();
P_B_A_B.id = "P_B_A_B";
P_B_A_B.page = "test";

N_B_A.appendPanelNode(P_B_A_A, P_B_A_B);

const P_B_B_A = new PanelNode();
P_B_B_A.id = "P_B_B_A";
P_B_B_A.page = "test";

const P_B_B_B = new PanelNode();
P_B_B_B.id = "P_B_B_B";
P_B_B_B.page = "test";

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

                const addAdd = useCallback(() => {
                    const test = new PanelNode();
                    test.id = uniqueId();
                    test.page = "test";
                    N.addPanelNode(test, MASK_PART.LEFT, N);
                    update();
                }, [update]);

                const onClick = useCallback(async () => {
                    try {
                        // addAdd();
                        // const target = ROOT.findLayoutNode((l, level) => {
                        //     console.log("level", level);
                        //     return l.id === ROOTID;
                        // });
                        const target = ROOT.findNodeByRule([
                            { direction: LAYOUT_DIRECTION.COL, max: 3 },
                            { direction: LAYOUT_DIRECTION.TAB, max: 2 },
                        ]);
                        console.log(target);
                    } catch (error) {
                        console.error(error);
                    }
                }, []);

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
        console.log(ROOT);
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
