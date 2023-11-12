import { createSelectTabAction } from "@idealjs/layout-manager";
import { derive } from "@idealjs/reactive/jsx-runtime";

import { panels, RootLayout, updateLayout } from "../store";

const Tab = (props: { panelId: string }) => {
  const { panelId } = props;
  const panel = derive(() => panels.val.find((v) => v.id === panelId));

  const style = derive(() => {
    return {
      backgroundColor: panel.val?.selected ? "white" : "gray",
    };
  });

  return (
    <div
      style={() => ({
        backgroundColor: style.val.backgroundColor,
      })}
      onclick={() => {
        RootLayout.doAction(
          createSelectTabAction({
            search: panelId,
          })
        );
        updateLayout();
      }}
    >
      Tab
    </div>
  );
};

export default Tab;
