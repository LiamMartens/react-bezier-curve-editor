import React from "react";
import styles from "./BezierCurveEditor.module.css";

type Props = {
  size: number;
  outerAreaSize: number;
  strokeWidth: number;
  innerAreaColor?: string;
  rowColor?: string;
};

export function BezierCurveEditorPlane({ size, outerAreaSize, strokeWidth, innerAreaColor, rowColor }: Props) {
  return (
    <div
      className={styles.plane}
      style={{
        top: `${outerAreaSize + strokeWidth}px`,
        left: `${strokeWidth}px`,
        width: `${size - strokeWidth}px`,
        height: `${size}px`,
      }}
    >
      <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="101" className={styles.innerArea} fill={innerAreaColor} />
        <g className={styles.row} fill={rowColor}>
          <rect width="100" height="5" />
          <rect y="10" width="100" height="5" />
          <rect y="20" width="100" height="5" />
          <rect y="30" width="100" height="5" />
          <rect y="40" width="100" height="5" />
          <rect y="50" width="100" height="5" />
          <rect y="60" width="100" height="5" />
          <rect y="70" width="100" height="5" />
          <rect y="80" width="100" height="5" />
          <rect y="90" width="100" height="5" />
        </g>
      </svg>
    </div>
  );
}
