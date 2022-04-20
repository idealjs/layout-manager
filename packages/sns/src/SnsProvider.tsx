import {
    createContext,
    FC,
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
} from "react";

import Slot, { SlotId } from "./slot";
import Sns from "./sns";

const defaultSns = new Sns();
const context = createContext<Sns>(defaultSns);

const SnsProvider: FC<
    React.PropsWithChildren<PropsWithChildren<{ sns?: Sns }>>
> = (props) => {
    const { children, sns = defaultSns } = props;
    return <context.Provider value={sns}>{children}</context.Provider>;
};

export const useSns = () => {
    const sns = useContext(context);
    return sns;
};

export const useSlot = (slotId: SlotId): Slot | null => {
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

export default SnsProvider;
