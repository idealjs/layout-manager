import { upsert } from "@idealjs/reactive";

import App from "./App";

const root = document.getElementById("app")!;

upsert(root, <App />);
