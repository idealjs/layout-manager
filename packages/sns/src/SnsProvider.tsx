import {
    createContext,
    FC,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import Slot, { SlotId } from "src/slot";
import Sns, { SnsUpdate } from "src/sns";

const defaultSns = new Sns();
const context = createContext<Sns>(defaultSns);

const SnsProvider: FC<{ sns?: Sns }> = (props) => {
    const { children, sns = defaultSns } = props;
    return <context.Provider value={sns}>{children}</context.Provider>;
};

export const useSns = () => {
    const sns = useContext(context);
    return sns;
};

export const useSlot = (id: SlotId): Slot | undefined => {
    const sns = useSns();

    const [slot, setSlot] = useState<Slot | undefined>(sns.find(id));

    const onSnsUpdate = useCallback(() => {
        setSlot(sns.find(id));
    }, [id, sns]);

    useEffect(() => {
        sns.addListener(SnsUpdate, onSnsUpdate);
        return () => {
            sns.removeListener(SnsUpdate, onSnsUpdate);
        };
    }, [id, onSnsUpdate, sns]);

    return slot;
};

export const useSetSlot = (id: SlotId) => {
    const sns = useSns();
    const [slot] = useState<Slot>(new Slot(id));

    useEffect(() => {
        sns.addSlot(slot);
        return () => {
            sns.removeSlot(slot);
        };
    }, [id, slot, sns]);

    return slot;
};

export default SnsProvider;
