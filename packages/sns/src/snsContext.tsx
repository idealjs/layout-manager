import { createContext } from "react";

import Sns from "./sns";

const sns = new Sns();
const snsContext = createContext<Sns>(sns);

export default snsContext;
