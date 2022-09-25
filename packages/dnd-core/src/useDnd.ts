import { createContext, useContext } from "react";

import Dnd from "./Dnd";

export const DndContext = createContext(new Dnd());

const useDnd = () => {
    return useContext(DndContext);
};

export default useDnd;
