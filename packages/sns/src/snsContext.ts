import { createContext } from "react";

import Sns, { sns } from "./Sns";

const snsContext = createContext<Sns>(sns);

export default snsContext;
