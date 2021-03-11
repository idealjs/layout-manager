# 结构设计

## 节点介绍

Layout-Manager 有两种重要节点

他们是

-   IPanelNode
-   ILayoutNode

节点之间通过 `parentId` 属性与 `children` 相互关联。

### ILayoutNode

负责控制子节点的布局

子节点：`ILayoutNode`，`IPanelNode`。
ILayoutNode 拥有 Direction 属性，表示 Layout 的具体布局方式。
如果是 Tab 则采用 Widget 组件布局，其他则递归使用 Layout 布局

### IPanelNode

负责存储一些信息

-   将要显示的页面名称 `page`
-   是否被选中 `selected`

子节点：无

### 存储结构

得益于 `@reduxjs/toolkit` 节点以扁平化方式存储。

### 控制方式

在页面发出节点变化事件之后（如：移动节点，关闭节点），
Layout-Manager 采用先计算新布局节点->摇树（剔除旧的无用节点），后设值`dispatch(setAll(...))`的方式来控制节点变化。

## 依赖库

### @idealjs/drag-drop

定制化拖拽组件，不限于 `HTMLElement`的拖拽。

也可以用于 `SVGElement` 的拖拽实现。

