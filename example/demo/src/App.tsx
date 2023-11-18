import { createState, useEffect } from "@idealjs/reactive";

import Layout from "./Layout";
import { updateLayout } from "./store";

const App = () => {
  const root = createState<HTMLDivElement>(null);
  useEffect(() => {
    if (root.val != null) {
      const observer = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect != null) {
          updateLayout(entries[0]?.contentRect);
        }
      });
      observer.observe(root.val);
      return () => {
        observer.disconnect();
      };
    }
  });

  return (
    <div ref={root} className="App" style={{ height: "100vh", width: "100vw" }}>
      <Layout />
    </div>
  );
};

export default App;
