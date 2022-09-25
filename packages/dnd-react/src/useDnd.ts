import { Dnd } from "@idealjs/dnd-core";
import { createContext, useContext } from "react";

export const DndContext = createContext(new Dnd());

const useDnd = () => {
    return useContext(DndContext);
};

export default useDnd;
