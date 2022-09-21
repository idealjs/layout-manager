/// <reference types="@idealjs/layout-manager/custom" />

import "valtio";
import "@idealjs/sns";

declare module "@idealjs/sns" {
    interface Slot extends ISlot {}

    interface Sns extends ISns {
        public send(target: string | number, event: "popin", data?: any): this;
    }
}

declare module "@idealjs/sns" {
    interface Slot extends ISlot {
        addListener(event: "ready", listener: (...args: any[]) => void): this;
        addListener(
            event: "popin",
            listener: (data: { panelNode: PanelNode }) => void
        ): this;

        addListener(
            event: SLOT_EVENT.ADD_PANEL,
            listener: (data: ADD_PANEL_DATA) => void
        ): this;
        addListener(
            event: SLOT_EVENT.MOVE_PANEL,
            listener: (data: MOVE_PANEL_DATA) => void
        ): this;
        addListener(
            event: SLOT_EVENT.MOVE_SPLITTER,
            listener: (data: MOVE_SPLITTER_DATA) => void
        ): this;
        addListener(
            event: SLOT_EVENT.REMOVE_PANEL,
            listener: (data: REMOVE_PANEL_DATA) => void
        ): this;
        addListener(
            event: SLOT_EVENT.SELECT_TAB,
            listener: (data: SELECT_TAB_DATA) => void
        ): this;
    }

    interface Sns extends ISns {
        send(target: string | number, event: "popin", data?: any): this;

        send(
            target: string | number,
            event: SLOT_EVENT.ADD_PANEL,
            data: ADD_PANEL_DATA
        ): this;
        send(
            target: string | number,
            event: SLOT_EVENT.MOVE_PANEL,
            data: MOVE_PANEL_DATA
        ): this;
        send(
            target: string | number,
            event: SLOT_EVENT.MOVE_SPLITTER,
            data: MOVE_SPLITTER_DATA
        ): this;
        send(
            target: string | number,
            event: SLOT_EVENT.REMOVE_PANEL,
            data: REMOVE_PANEL_DATA
        ): this;
        send(
            target: string | number,
            event: SLOT_EVENT.SELECT_TAB,
            data: SELECT_TAB_DATA
        ): this;
    }
}

declare module "valtio" {
    function useSnapshot<T extends object>(p: T): T;
}
