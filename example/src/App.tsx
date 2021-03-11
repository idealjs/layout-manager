import React, { useCallback, useEffect, useState } from "react";

import {
    Layout,
    Provider,
    CMPTFactory,
    IPanelNode,
    LAYOUT_DIRECTION,
    LayoutNode,
} from "@idealjs/layout-manager";
import CustomTab from "./component/CustomTab";
import Popout, { PopoutContext } from "./component/Popout";
import { Fragment } from "react";

const N = new LayoutNode();
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

N.append(N_A).append(N_B);
N_B.append(N_B_A).append(N_B_B);

console.log(N);

const panels: IPanelNode[] = [
    {
        id: "A_A",
        parentId: "N_A",
        page: "test",
        selected: false,
    },
    {
        id: "A_B",
        parentId: "N_A",
        page: "test",
        selected: false,
    },
    {
        id: "B_B_B",
        parentId: "N_B_B",
        page: "test",
        selected: false,
    },
    {
        id: "B_B_A",
        parentId: "N_B_B",
        page: "test",
        selected: false,
    },
    {
        id: "B_A_B",
        parentId: "N_B_A",
        page: "test2",
        selected: false,
    },
    {
        id: "B_A_A",
        parentId: "N_B_A",
        page: "test",
        selected: false,
    },
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

    return (
        <Fragment>
            <div className="App" style={{ height: 500, width: 500 }}>
                <button onClick={onClick}>open portal</button>
                <Provider panels={panels} factory={factory} Tab={CustomTab}>
                    <Layout layoutNode={N} />
                </Provider>
            </div>
            <PopoutContext.Provider value={portalState}>
                <Popout />
            </PopoutContext.Provider>
        </Fragment>
    );
}

export default App;
