import { derive, JSXChildren } from "@idealjs/reactive";

import { layouts } from "../store";

const TitleBar = (props: { layoutId: string; children: JSXChildren }) => {
  const { children, layoutId } = props;
  const layout = derive(() => layouts.val.find((v) => v.id === layoutId));

  const style = derive(() => {
    return {
      height: 24,
      width: layout.val?.width,
      left: layout.val?.left,
      top: layout.val?.top,
    };
  });

  return (
    <div
      style={() => ({
        position: "absolute",
        display: "flex",
        userSelect: "none",
        backgroundColor: "#c5c3c6",
        overflowY: "hidden",
        overflowX: "auto",
        height: `${style.val.height}px`,
        width: `${style.val.width}px`,
        left: `${style.val.left}px`,
        top: `${style.val.top}px`,
      })}
    >
      {children}
    </div>
  );
};

export default TitleBar;
