import { LAYOUT_DIRECTION } from "@idealjs/layout-manager";
import { derive } from "@idealjs/reactive/jsx-runtime";

import { layouts, splitters } from "../store";

const Splitter = (props: { splitterId: string }) => {
  const { splitterId } = props;
  const splitter = derive(() => splitters.val.find((v) => v.id === splitterId));
  const parent = derive(() =>
    layouts.val.find((v) => v.id === splitter.val?.parentId)
  );

  const isCOL = derive(() => parent.val?.direction === LAYOUT_DIRECTION.COL);

  const splitterStyle = derive(() => {
    let { height, width, left, top } = splitter.val ?? {};
    if (height === 0) {
      height = 4;
    }
    if (width === 0) {
      width = 4;
    }

    return {
      left: !isCOL.val ? left ?? 0 - 4 : left,
      top: isCOL.val ? top ?? 0 - 4 : top,
      height,
      width,
    };
  });

  return (
    <div
      style={() => ({
        height: `${splitterStyle.val.height}px`,
        width: `${splitterStyle.val.width}px`,
        left: `${splitterStyle.val.left}px`,
        top: `${splitterStyle.val.top}px`,
        position: "absolute",
        backgroundColor: "gray",
      })}
    ></div>
  );
};

export default Splitter;
