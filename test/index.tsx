import "react-bezier-curve-editor/index.css";
import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { BezierCurveEditor, ValueType } from "react-bezier-curve-editor";

function App() {
  const [value, setValue] = useState<ValueType>([0, 0, 1, 1]);

  return (
    <div style={{ width: "500px" }}>
      <BezierCurveEditor enablePreview value={value} onChange={setValue} />
    </div>
  );
}

createRoot(document.getElementById("app")).render(<App />);
