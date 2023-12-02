import React, { MouseEvent, PointerEvent, TouchEvent, useCallback, useRef, useState } from "react";
import cx from "classnames";
import styles from "./BezierCurveEditor.module.css";
import { BezierCurveEditorPlane } from "./BezierCurveEditorPlane";
import type { ValueType } from "../../types";
import { BezierCurveEditorCurve } from "./BezierCurveEditorCurve";
import { BezierCurveEditorEndPoints } from "./BezierCurveEditorEndPoints";
import { bezierCurveParamsFromSizeAndValue } from "../../utils";

export type BezierCurveEditorProps = {
  size?: number;
  outerAreaSize?: number;
  outerAreaColor?: string;
  innerAreaColor?: string;
  strokeWidth?: number;
  rowColor?: string;
  fixedHandleColor?: string;
  curveLineColor?: string;
  handleLineColor?: string;
  startHandleColor?: string;
  endHandleColor?: string;
  className?: string;
  startHandleClassName?: string;
  startHandleActiveClassName?: string;
  endHandleClassName?: string;
  endHandleActiveClassName?: string;
  enablePreview?: boolean;
  value?: ValueType;
  onChange?: (value: ValueType) => void;
};

const defaultProps = {
  size: 200,
  outerAreaSize: 50,
  strokeWidth: 2,
  value: [0.4, 0, 1, 0.6] satisfies ValueType, // easeIn
};

export function BezierCurveEditor(props: BezierCurveEditorProps) {
  const {
    size = defaultProps.size,
    strokeWidth = defaultProps.strokeWidth,
    outerAreaSize = defaultProps.outerAreaSize,
    value = defaultProps.value,
    innerAreaColor,
    outerAreaColor,
    rowColor,
    handleLineColor,
    curveLineColor,
    fixedHandleColor,
    startHandleColor,
    endHandleColor,
    enablePreview,
    className,
    startHandleClassName,
    endHandleClassName,
    startHandleActiveClassName,
    endHandleActiveClassName,
    onChange,
  } = props;

  const [movingStartHandle, setMovingStartHandle] = useState(false);
  const [movingEndHandle, setMovingEndHandle] = useState(false);
  const startValueRef = useRef(value);
  const movingStartHandleStartRef = useRef({ x: 0, y: 0 });
  const movingEndHandleStartRef = useRef({ x: 0, y: 0 });
  const { startCoordinate, endCoordinate, startBezierHandle, endBezierHandle } = bezierCurveParamsFromSizeAndValue(
    size,
    value
  );

  const clampValue = (value: ValueType) => {
    const allowedOuterValue = outerAreaSize / size;
    const nextValue = [...value] satisfies ValueType;
    nextValue[0] = Math.max(0, Math.min(1, nextValue[0]));
    nextValue[2] = Math.max(0, Math.min(1, nextValue[2]));
    nextValue[1] = Math.max(-allowedOuterValue, Math.min(1 + allowedOuterValue, nextValue[1]));
    nextValue[3] = Math.max(-allowedOuterValue, Math.min(1 + allowedOuterValue, nextValue[3]));
    return nextValue;
  };

  const moveHandles = (x: number, y: number) => {
    const relevantStart = movingStartHandle
      ? movingStartHandleStartRef.current
      : movingEndHandle
      ? movingEndHandleStartRef.current
      : undefined;

    if (movingStartHandle || movingEndHandle) {
      const relXMoved = (x - relevantStart.x) / size;
      const relYMoved = (y - relevantStart.y) / size;
      const nextValue = [...startValueRef.current] satisfies ValueType;

      if (movingStartHandle) {
        nextValue[0] = nextValue[0] + relXMoved;
        nextValue[1] = nextValue[1] - relYMoved;
      }

      if (movingEndHandle) {
        nextValue[2] = nextValue[2] + relXMoved;
        nextValue[3] = nextValue[3] - relYMoved;
      }

      const clampedValue = clampValue(nextValue);
      if (onChange) onChange?.(clampedValue);
    }
  };

  const handleStartHandleStartMoving = (event: PointerEvent<HTMLButtonElement>) => {
    if (movingStartHandle) return;

    event.preventDefault();

    setMovingStartHandle(true);
    const startX = event.screenX;
    const startY = event.screenY;
    startValueRef.current = [...value];
    movingStartHandleStartRef.current = { x: startX, y: startY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleStartHandlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (movingStartHandle) {
      const x = event.screenX;
      const y = event.screenY;
      moveHandles(x, y);
    }
  };

  const handleStartHandlePointerLeaveOrUp = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId);
    setMovingStartHandle(false);
  };

  const handleEndHandleStartMoving = (event: PointerEvent<HTMLButtonElement>) => {
    if (movingEndHandle) return;

    setMovingEndHandle(true);
    const startX = event.screenX;
    const startY = event.screenY;
    startValueRef.current = [...value];
    movingEndHandleStartRef.current = { x: startX, y: startY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleEndHandlePointerMove = (event: PointerEvent<HTMLButtonElement>) => {
    if (movingEndHandle) {
      const x = event.screenX;
      const y = event.screenY;
      moveHandles(x, y);
    }
  };

  const handleEndHandlePointerLeaveOrUp = (event: PointerEvent<HTMLButtonElement>) => {
    event.currentTarget.releasePointerCapture(event.pointerId);
    setMovingEndHandle(false);
  };

  return (
    <div className={cx(styles.root, className)}>
      <div className={styles.wrap}>
        <div
          role="presentation"
          className={styles.bg}
          style={{
            left: `${strokeWidth}px`,
            width: `${size - strokeWidth}px`,
            backgroundColor: outerAreaColor,
          }}
        ></div>

        <BezierCurveEditorPlane
          size={size}
          outerAreaSize={outerAreaSize}
          strokeWidth={strokeWidth}
          innerAreaColor={innerAreaColor}
          rowColor={rowColor}
        />

        <BezierCurveEditorCurve
          value={value}
          size={size}
          strokeWidth={strokeWidth}
          outerAreaSize={outerAreaSize}
          handleLineColor={handleLineColor}
          curveLineColor={curveLineColor}
          previewState={!enablePreview ? "hidden" : movingStartHandle || movingEndHandle ? "paused" : "running"}
        />

        <BezierCurveEditorEndPoints
          size={size}
          value={value}
          outerAreaSize={outerAreaSize}
          strokeWidth={strokeWidth}
          handleLineColor={handleLineColor}
          fixedHandleColor={fixedHandleColor}
        />

        <button
          type="button"
          className={cx(styles.handle, styles.start, startHandleClassName, {
            [styles.active]: movingStartHandle,
            [startHandleActiveClassName]: !!startHandleActiveClassName && movingStartHandle,
          })}
          style={{
            top: `${startBezierHandle[1] + outerAreaSize + strokeWidth}px`,
            left: `${startBezierHandle[0] + strokeWidth}px`,
            color: startHandleColor,
            backgroundColor: startHandleColor,
          }}
          onPointerDown={handleStartHandleStartMoving}
          onPointerMove={handleStartHandlePointerMove}
          onPointerUp={handleStartHandlePointerLeaveOrUp}
        ></button>
        <button
          type="button"
          className={cx(styles.handle, styles.end, endHandleClassName, {
            [styles.active]: movingEndHandle,
            [endHandleActiveClassName]: !!endHandleActiveClassName && movingEndHandle,
          })}
          style={{
            top: `${endBezierHandle[1] + outerAreaSize + strokeWidth}px`,
            left: `${endBezierHandle[0] + strokeWidth}px`,
            color: endHandleColor,
            backgroundColor: endHandleColor,
          }}
          onPointerDown={handleEndHandleStartMoving}
          onPointerMove={handleEndHandlePointerMove}
          onPointerUp={handleEndHandlePointerLeaveOrUp}
        ></button>
      </div>
    </div>
  );
}
