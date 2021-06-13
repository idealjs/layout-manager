# 规范目的

为了规范 git commit ，方便追踪每次提交的功能，制定以下 git commit 规范。

# commit 规范

commit 以 `type(module): message` 为统一规范，其中 type、module、message 均为每次提交的实际值，每一个字段的解释如下：

## type

-   feat：新功能（feature）
-   fix：修补 bug
-   docs：更新文档（documentation）
-   style： 格式变动（不影响代码运行的变动）
-   refactor：重构（即不是新增功能，也不是修改 bug 的代码变动）
-   test：增加测试 case
-   chore：构建过程或辅助工具的变动
-   example: 示例修改

## module

指更新的模块，当前值为：

-   gl(grape-layout)
-   lm(layout-manager)
-   dnd(drag-and-drop)

## message

message 是本次实际的提交信息，统一使用 `英文` 提交。

## 例子

例如，本次提交新增了 layout 的 addWidget 接口，那么 commit 可能是：

```
$ git commit -a -m "feat(lm): add addWidget api"
```
