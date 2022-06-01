# 使用 CRA 快速开始

## 安装

```
yarn add @idealjs/layout-manager html2canvas reselect
```

## 使用

### Hello World

App.tsx

```ts
import { ILayoutJSON, Layout, LAYOUT_DIRECTION } from "@idealjs/layout-manager";
import { CMPTFactory, LayoutNode, Provider } from "@idealjs/layout-manager";

const layoutJSON: ILayoutJSON = {
    id: "layout-manager-root",
    direction: LAYOUT_DIRECTION.ROOT,

    primaryOffset: 0,
    secondaryOffset: 0,
    layouts: [
        {
            id: "mainN",
            direction: LAYOUT_DIRECTION.COL,
            primaryOffset: 0,
            secondaryOffset: 0,
            layouts: [
                {
                    id: "N_A",
                    direction: LAYOUT_DIRECTION.TAB,
                    primaryOffset: 0,
                    secondaryOffset: 0,
                    layouts: [],
                    panels: [
                        {
                            id: "P_A_A",
                            page: "hello",
                        },
                    ],
                },
            ],
            panels: [],
        },
    ],
    panels: [],
};

const layout = new LayoutNode({ layoutJSON });

const HelloWorld = () => {
    return <div>Hello World</div>;
};

const factory: CMPTFactory = (page: string) => {
    switch (page) {
        case "hello":
            return HelloWorld;
        default:
            return () => null;
    }
};

const App = () => {
    return (
        <div className="App" style={{ height: "100vh", width: "100vw" }}>
            <Provider
                layoutSymbol={"mainLayout"}
                layoutNode={layout}
                factory={factory}
                splitterThickness={4}
                titlebarHeight={24}
            >
                <Layout />
            </Provider>
        </div>
    );
};

export default App;
```

codesandbox

### 加载定义窗口组件

Counter.tsx

```ts
import { useState } from "react";

const Counter = () => {
    const [count, setCount] = useState(0);
    return (
        <div>
            <div>{count}</div>
            <button
                onClick={() => {
                    setCount((c) => c + 1);
                }}
            >
                +
            </button>
        </div>
    );
};

export default Counter;
```

在 factory 函数中添加新的 case

```ts
const factory: CMPTFactory = (page: string) => {
    switch (page) {
        case "hello":
            return HelloWorld;
        case "counter":
            return Counter;
        default:
            return () => null;
    }
};
```

修改布局 json

```ts
const layoutJSON: ILayoutJSON = {
    id: "layout-manager-root",
    direction: LAYOUT_DIRECTION.ROOT,

    primaryOffset: 0,
    secondaryOffset: 0,
    layouts: [
        {
            id: "mainN",
            direction: LAYOUT_DIRECTION.COL,
            primaryOffset: 0,
            secondaryOffset: 0,
            layouts: [
                {
                    id: "N_A",
                    direction: LAYOUT_DIRECTION.TAB,
                    primaryOffset: 0,
                    secondaryOffset: 0,
                    layouts: [],
                    panels: [
                        {
                            id: "P_A_A",
                            page: "hello",
                        },
                        {
                            id: "P_A_B",
                            page: "counter",
                        },
                    ],
                },
            ],
            panels: [],
        },
    ],
    panels: [],
};
```

codesandbox
