import React from "react";
import cx from "classnames";
import styles from "./BezierCurveEditor.module.css";
import { ExpandedValueType, ValueType } from "../../types";
import { bezierCurveParamsFromSizeAndValue } from "../../utils";

interface Props {
  activeClassName: string;
  size: number;
  value: ExpandedValueType;
  outerAreaSize: number;
  strokeWidth: number;
  handleLineColor: string;
  fixedHandleColor: string;
  isEditable: boolean;
  movingStartPoint: boolean;
  handleStartPointStartMoving: React.PointerEventHandler<HTMLButtonElement>;
  handleStartPointPointerMove: React.PointerEventHandler<HTMLButtonElement>;
  handleStartPointPointerLeaveOrUp: React.PointerEventHandler<HTMLButtonElement>;
  movingEndPoint: boolean;
  handleEndPointStartMoving: React.PointerEventHandler<HTMLButtonElement>;
  handleEndPointPointerMove: React.PointerEventHandler<HTMLButtonElement>;
  handleEndPointPointerLeaveOrUp: React.PointerEventHandler<HTMLButtonElement>;
}

export function BezierCurveEditorEndPoints({
  size,
  value,
  outerAreaSize,
  strokeWidth,
  handleLineColor,
  fixedHandleColor,
  activeClassName,
  ...props
}: Props) {
  const { startCoordinate, endCoordinate } = bezierCurveParamsFromSizeAndValue(size, value);

  if (props.isEditable !== true) {
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

  const {
    movingEndPoint,
    movingStartPoint,
    handleEndPointPointerLeaveOrUp,
    handleEndPointPointerMove,
    handleEndPointStartMoving,
    handleStartPointPointerLeaveOrUp,
    handleStartPointPointerMove,
    handleStartPointStartMoving,
  } = props;

  return (
    <>
      <button
        type="button"
        className={cx(styles.handle, styles.fixed, {
          [styles.active]: movingStartPoint,
          [activeClassName]: !!activeClassName && movingStartPoint,
        })}
        style={{
          top: `${startCoordinate[1] + outerAreaSize + strokeWidth}px`,
          left: `${startCoordinate[0] + strokeWidth}px`,
          borderColor: handleLineColor,
          backgroundColor: fixedHandleColor,
        }}
        onPointerDown={handleStartPointStartMoving}
        onPointerMove={handleStartPointPointerMove}
        onPointerUp={handleStartPointPointerLeaveOrUp}
      ></button>
      <button
        type="button"
        className={cx(styles.handle, styles.fixed, {
          [styles.active]: movingEndPoint,
          [activeClassName]: !!activeClassName && movingEndPoint,
        })}
        style={{
          top: `${endCoordinate[1] + outerAreaSize + strokeWidth}px`,
          left: `${endCoordinate[0] + strokeWidth}px`,
          borderColor: handleLineColor,
          backgroundColor: fixedHandleColor,
        }}
        onPointerDown={handleEndPointStartMoving}
        onPointerMove={handleEndPointPointerMove}
        onPointerUp={handleEndPointPointerLeaveOrUp}
      ></button>
    </>
  );
}
