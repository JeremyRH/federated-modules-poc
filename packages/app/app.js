import React from "react";
import ReactDOM from "react-dom";
import ComponentA from "@jeremyrh/component-a/index";

const LazyComponentB = React.lazy(() => import("@jeremyrh/component-b/index"));

function App() {
  return (
    <>
      <ComponentA />
      <React.Suspense fallback={<div className="spinner" />}>
        <LazyComponentB />
      </React.Suspense>
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
