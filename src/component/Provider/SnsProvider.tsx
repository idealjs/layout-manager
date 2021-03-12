import { createContext, FC, useContext, useMemo } from "react";

import Sns from "../../lib/sns/Sns";

const sns = new Sns();
const context = createContext<Sns | null>(null);

const SnsProvider: FC = (props) => {
    const { children } = props;
    return <context.Provider value={sns}>{children}</context.Provider>;
};

export const useSns = () => {
    const sns = useContext(context);
    if (sns == null) {
        throw new Error("");
    }
    return sns;
};

export const useSlot = (id: Symbol) => {
    const sns = useSns();

    const slot = useMemo(() => {
        const slot = sns.setSlot(id);
        return slot;
    }, [id, sns]);

    return slot;
};

export default SnsProvider;
