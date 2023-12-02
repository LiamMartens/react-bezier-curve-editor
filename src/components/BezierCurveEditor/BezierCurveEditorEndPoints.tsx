import React from "react";
import cx from "classnames";
import styles from "./BezierCurveEditor.module.css";
import { ValueType } from "../../types";
import { bezierCurveParamsFromSizeAndValue } from "../../utils";

type Props = {
  size: number;
  value: ValueType;
  outerAreaSize: number;
  strokeWidth: number;
  handleLineColor: string;
  fixedHandleColor: string;
};

export function BezierCurveEditorEndPoints({
  size,
  value,
  outerAreaSize,
  strokeWidth,
  handleLineColor,
  fixedHandleColor,
}: Props) {
  const { startCoordinate, endCoordinate } = bezierCurveParamsFromSizeAndValue(size, value);

  return (
    <>
      <span
        className={cx(styles.handle, styles.fixed)}
        style={{
          top: `${startCoordinate[1] + outerAreaSize + strokeWidth}px`,
          left: `${startCoordinate[0] + strokeWidth}px`,
          borderColor: handleLineColor,
          backgroundColor: fixedHandleColor,
        }}
      ></span>
      <span
        className={cx(styles.handle, styles.fixed)}
        style={{
          top: `${endCoordinate[1] + outerAreaSize + strokeWidth}px`,
          left: `${endCoordinate[0] + strokeWidth}px`,
          borderColor: handleLineColor,
          backgroundColor: fixedHandleColor,
        }}
      ></span>
    </>
  );
}
