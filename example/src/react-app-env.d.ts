/// <reference types="react-scripts" />

import { Slot as ISlot, Sns as ISns } from '@idealjs/layout-manager'

declare module '@idealjs/layout-manager' {
    interface Slot extends ISlot {
        public addListener(event: "ready", listener: (...args: any[]) => void): this;
    }

    interface Sns extends ISns {
        public send(target: string | number, event: "popin", data?: any): this;
    }

}

