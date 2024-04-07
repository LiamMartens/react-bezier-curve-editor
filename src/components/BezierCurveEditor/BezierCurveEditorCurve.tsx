import React from "react";
import styles from "./BezierCurveEditor.module.css";
import { ExpandedValueType } from "../../types";
import { bezierCurveParamsFromSizeAndValue } from "../../utils";

type Props = {
  value: ExpandedValueType;
  size: number;
  strokeWidth: number;
  outerAreaSize: number;
  handleLineColor?: string;
  curveLineColor?: string;
  previewState?: "running" | "paused" | "hidden";
};

export function BezierCurveEditorCurve({
  value,
  size,
  strokeWidth,
  outerAreaSize,
  handleLineColor,
  curveLineColor,
  previewState,
}: Props) {
  const { startCoordinate, endCoordinate, startBezierHandle, endBezierHandle } = bezierCurveParamsFromSizeAndValue(
    size,
    value
  );

  const svgWidth = size + strokeWidth * 2;
  const svgHeight = size + strokeWidth * 2 + outerAreaSize * 2;

  return (
    <svg
      className={styles.curve}
      fill="none"
      width={svgWidth}
      height={svgHeight}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
    >
      <g transform={`translate(${strokeWidth}, ${outerAreaSize + strokeWidth})`}>
        <line
          className={styles.handleLine}
          stroke={handleLineColor}
          strokeWidth="1"
          strokeLinecap="round"
          x1={startCoordinate[0]}
          y1={startCoordinate[1]}
          x2={startBezierHandle[0]}
          y2={startBezierHandle[1]}
        />
        <line
          className={styles.handleLine}
          stroke={handleLineColor}
          strokeWidth="1"
          strokeLinecap="round"
          x1={endCoordinate[0]}
          y1={endCoordinate[1]}
          x2={endBezierHandle[0]}
          y2={endBezierHandle[1]}
        />
        <path
          className={styles.curveLine}
          stroke={curveLineColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          d={`M${startCoordinate} C${startBezierHandle} ${endBezierHandle} ${endCoordinate}`}
        />

        {previewState !== "hidden" && (
          <circle
            className={styles.preview}
            r={8}
            cx={0}
            cy={0}
            strokeWidth={strokeWidth}
            style={{
              offsetPath: `path('M${startCoordinate} C${startBezierHandle} ${endBezierHandle} ${endCoordinate}')`,
              animationTimingFunction: `cubic-bezier(${value})`,
              animationPlayState: previewState,
            }}
          />
        )}
      </g>
    </svg>
  );
}
