import { useEffect, useState } from "react";

import Slot, { SlotId } from "./Slot";
import useSns from "./useSns";

const useSlot = (slotId: SlotId): Slot | null => {
    const sns = useSns();

    const [slot, setSlot] = useState<Slot | null>(null);

    useEffect(() => {
        setSlot(sns.setSlot(slotId));
        return () => {
            setSlot(null);
            sns.removeSlot(slotId);
        };
    }, [setSlot, slotId, sns]);

    return slot;
};

export default useSlot;

export const sns = 0;
