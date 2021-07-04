/// <reference types="react-scripts" />

import { PanelNode, Slot as ISlot, Sns as ISns } from "@idealjs/sns";

declare module "@idealjs/sns" {
    interface Slot extends ISlot {
        public addListener(
            event: "ready",
            listener: (...args: any[]) => void
        ): this;
        public addListener(
            event: "popin",
            listener: (data: { panelNode: PanelNode }) => void
        ): this;
    }

    interface Sns extends ISns {
        public send(target: string | number, event: "popin", data?: any): this;
    }
}
