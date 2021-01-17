# 结构设计

## 节点介绍
Layout-Manager 有三种重要节点

他们是

- IPanelNode
- IWidgetNode
- ILayoutNode

节点之间通过 `parentId` 属性与 `children` 相互关联。

### ILayoutNode
负责控制子节点的布局

子节点：`ILayoutNode` ，`IWidgetNode`。

### IWidgetNode
负责将子节点以 `Tab` 组件的形式显示在 `Titlebar` 组件上

并且，在其余空白处显示点击了对应 `Tab` 的子节点。

子节点：`IPanelNode`

### IPanelNode
负责存储一些信息
- 将要显示的页面名称 `page`
- 是否被选中 `selected`

子节点：无

### 存储结构
得益于 `@reduxjs/toolkit` 节点以扁平化方式存储。

### 控制方式
在页面发出节点变化事件之后（如：移动节点，关闭节点），
Layout-Manager 采用先计算新布局节点->摇树（剔除旧的无用节点），后设值的方式来控制节点变化。
