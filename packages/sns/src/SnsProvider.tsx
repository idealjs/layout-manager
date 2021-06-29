import Slot from "src/slot";
import Sns from "src/sns";

import { createContext, FC, useContext, useMemo } from "react";

const sns = new Sns();
const context = createContext<Sns>(sns);

const SnsProvider: FC<{ sns: Sns }> = (props) => {
    const { children, sns } = props;
    return <context.Provider value={sns}>{children}</context.Provider>;
};

export const useSns = () => {
    const sns = useContext(context);
    return sns;
};

export const useSlot = (id: string | number): Slot => {
    const sns = useSns();

    const slot = useMemo(() => {
        const slot = sns.setSlot(id);
        return slot;
    }, [id, sns]);

    return slot;
};

export default SnsProvider;
