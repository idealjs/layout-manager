import {
  createAddPanelAction,
  findNodeByRules,
  MASK_PART,
  PanelNode,
} from "@idealjs/layout-manager";
import { createState, derive, useEffect } from "@idealjs/reactive";

import { panels, RootLayout, updateLayout } from "../store";

const CounterPanel = (props: { panelId: string }) => {
  const { panelId } = props;
  const panel = derive(() => panels.val.find((panel) => panel.id === panelId));
  const hidden = derive(() => !panel.val?.selected);
  const state = createState(0);
  useEffect(() => {
    const handler = setInterval(() => {
      state.val++;
    }, 1000);

    return () => {
      clearInterval(handler);
    };
  });

  return (
    <div
      style={() => {
        return {
          height: `${panel.val?.height}px`,
          width: `${panel.val?.width}px`,
          top: `${panel.val?.top}px`,
          left: `${panel.val?.left}px`,
          position: "absolute",
          visibility: hidden.val ? "hidden" : undefined,
        };
      }}
    >
      <div
        style={{
          padding: "20px",
          height: "100%",
          boxSizing: "border-box",
        }}
      >
        <button
          onClick={() => {
            const target = findNodeByRules(RootLayout, [
              { part: MASK_PART.BOTTOM, max: 2 },
              { part: MASK_PART.RIGHT, max: 2 },
              { part: MASK_PART.TOP, max: 3, limitLevel: 1 },
              { part: MASK_PART.RIGHT, max: 3 },
              { part: MASK_PART.CENTER, max: 2 },
            ]);

            if (target != null) {
              RootLayout.doAction(
                createAddPanelAction({
                  panelNode: new PanelNode(),
                  mask: target.rule.part,
                  target: target?.layoutNode.id,
                })
              );
              updateLayout();
            }
          }}
        >
          add panel
        </button>
        <div>
          {() => {
            return `counter ${state.val}`;
          }}
        </div>
      </div>
    </div>
  );
};

export default CounterPanel;
