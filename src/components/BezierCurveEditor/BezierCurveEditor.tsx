import React from "react";
import cx from "classnames";
import styles from "./BezierCurveEditor.module.css";
import { BezierCurveEditorPlane } from "./BezierCurveEditorPlane";
import type { ExpandedValueType, ValueType } from "../../types";
import { BezierCurveEditorCurve } from "./BezierCurveEditorCurve";
import { BezierCurveEditorEndPoints } from "./BezierCurveEditorEndPoints";
import { bezierCurveParamsFromSizeAndValue } from "../../utils";
import { useHandleState } from "./hooks";

export interface Point {
  x: number;
  y: number;
}

interface BezierCurveEditorBaseProps {
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
  startNodeInitialYPosition?: number;
  endNodeInitialYPosition?: number;
}

interface BezierCurveEditorEditNodeProps {
  allowNodeEditing: true;
  value?: ExpandedValueType;
  onChange?: (value: ExpandedValueType) => void;
}
interface BezierCurveEditorFixedNodeProps {
  allowNodeEditing?: false;
  value?: ValueType;
  onChange?: (value: ValueType) => void;
}

type BezierCurveEditorProps = BezierCurveEditorBaseProps &
  (BezierCurveEditorEditNodeProps | BezierCurveEditorFixedNodeProps);

const defaultProps: BezierCurveEditorProps = {
  size: 200,
  outerAreaSize: 50,
  strokeWidth: 2,
  startNodeInitialYPosition: 0,
  endNodeInitialYPosition: 1,
  value: [0.4, 0, 1, 0.6], // easeIn
};

export function BezierCurveEditor({
  size = defaultProps.size,
  strokeWidth = defaultProps.strokeWidth,
  outerAreaSize = defaultProps.outerAreaSize,
  value: valueProp = defaultProps.value,
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
  startNodeInitialYPosition: startNodeYPosition = defaultProps.startNodeInitialYPosition,
  endNodeInitialYPosition: endNodeYPosition = defaultProps.endNodeInitialYPosition,
  ...props
}: BezierCurveEditorProps) {
  const initialValueRef = React.useRef<ExpandedValueType>(
    valueProp.length === 4 ? [startNodeYPosition, ...valueProp, endNodeYPosition] : valueProp
  );
  const value = React.useMemo((): ExpandedValueType => {
    return valueProp.length === 4 ? [0, ...valueProp, 1] : valueProp;
  }, [valueProp]);
  const updateValueRef = React.useCallback(() => {
    initialValueRef.current = [...value] satisfies ExpandedValueType;
  }, [value]);

  const moveStartHandle = React.useCallback(
    (start: Point, movement: Point) => {
      const nextValue = moveHandle(initialValueRef.current, size, [1, 2], start, movement);
      const clampedValue = clampValue(outerAreaSize, size, nextValue);
      if (props.onChange && props.allowNodeEditing) props.onChange( clampedValue);
      if (props.onChange && props.allowNodeEditing !== true) props.onChange(clampedValue.slice(1, 5) as ValueType);
    },
    [size, outerAreaSize, props.onChange, props.allowNodeEditing]
  );
  const [
    movingStartHandle,
    {
      handlePointerLeaveOrUp: handleStartHandlePointerLeaveOrUp,
      handlePointerMove: handleStartHandlePointerMove,
      handlePointerStartMoving: handleStartHandleStartMoving,
    },
  ] = useHandleState(moveStartHandle, updateValueRef);
  const moveEndHandle = React.useCallback(
    (start: Point, movement: Point) => {
      const nextValue = moveHandle(initialValueRef.current, size, [3, 4], start, movement);
      const clampedValue = clampValue(outerAreaSize, size, nextValue);
      if (props.onChange && props.allowNodeEditing) props.onChange( clampedValue);
      if (props.onChange && props.allowNodeEditing !== true) props.onChange(clampedValue.slice(1, 5) as ValueType);
    },
    [size, outerAreaSize, props.onChange, props.allowNodeEditing]
  );
  const [
    movingEndHandle,
    {
      handlePointerLeaveOrUp: handleEndHandlePointerLeaveOrUp,
      handlePointerMove: handleEndHandlePointerMove,
      handlePointerStartMoving: handleEndHandleStartMoving,
    },
  ] = useHandleState(moveEndHandle, updateValueRef);
  const moveStartPoint = React.useCallback(
    (start: Point, movement: Point) => {
      const nextValue = moveHandle(initialValueRef.current, size, [undefined, 0], start, movement);
      const clampedValue = clampValue(outerAreaSize, size, nextValue);
      if (props.onChange && props.allowNodeEditing) props.onChange( clampedValue);
      if (props.onChange && props.allowNodeEditing !== true) props.onChange(clampedValue.slice(1, 5) as ValueType);
    },
    [size, outerAreaSize, props.onChange, props.allowNodeEditing]
  );
  const [
    movingStartPoint,
    {
      handlePointerLeaveOrUp: handleStartPointPointerLeaveOrUp,
      handlePointerMove: handleStartPointPointerMove,
      handlePointerStartMoving: handleStartPointStartMoving,
    },
  ] = useHandleState(moveStartPoint, updateValueRef);
  const moveEndPoint = React.useCallback(
    (start: Point, movement: Point) => {
      const nextValue = moveHandle(initialValueRef.current, size, [undefined, 5], start, movement);
      const clampedValue = clampValue(outerAreaSize, size, nextValue);
      if (props.onChange && props.allowNodeEditing) props.onChange( clampedValue);
      if (props.onChange && props.allowNodeEditing !== true) props.onChange(clampedValue.slice(1, 5) as ValueType);
    },
    [size, outerAreaSize, props.onChange, props.allowNodeEditing]
  );
  const [
    movingEndPoint,
    {
      handlePointerLeaveOrUp: handleEndPointPointerLeaveOrUp,
      handlePointerMove: handleEndPointPointerMove,
      handlePointerStartMoving: handleEndPointStartMoving,
    },
  ] = useHandleState(moveEndPoint, updateValueRef);

  const { startBezierHandle, endBezierHandle } = bezierCurveParamsFromSizeAndValue(size, value);

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
          isEditable={props.allowNodeEditing}
          movingEndPoint={movingEndPoint}
          movingStartPoint={movingStartPoint}
          handleStartPointStartMoving={handleStartPointStartMoving}
          handleStartPointPointerMove={handleStartPointPointerMove}
          handleStartPointPointerLeaveOrUp={handleStartPointPointerLeaveOrUp}
          handleEndPointStartMoving={handleEndPointStartMoving}
          handleEndPointPointerMove={handleEndPointPointerMove}
          handleEndPointPointerLeaveOrUp={handleEndPointPointerLeaveOrUp}
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

function clampValue(outerAreaSize: number, size: number, value: ExpandedValueType): ExpandedValueType {
  const nextValue = [...value] satisfies ExpandedValueType;
  const allowedOuterValue = outerAreaSize / size;
  nextValue[1] = Math.max(0, Math.min(1, nextValue[1]));
  nextValue[3] = Math.max(0, Math.min(1, nextValue[3]));
  nextValue[0] = Math.max(0, Math.min(1, nextValue[0]));
  nextValue[5] = Math.max(0, Math.min(1, nextValue[5]));
  nextValue[2] = Math.max(-allowedOuterValue, Math.min(1 + allowedOuterValue, nextValue[2]));
  nextValue[4] = Math.max(-allowedOuterValue, Math.min(1 + allowedOuterValue, nextValue[4]));
  return nextValue;
}

function moveHandle(
  value: ExpandedValueType,
  size: number,
  targetIndices: [number | undefined, number],
  start: Point,
  { x, y }: Point
): ExpandedValueType {
  const nextValue = [...value] satisfies ExpandedValueType;
  const [xIndex, yIndex] = targetIndices;

  const relXMoved = (x - start.x) / size;
  const relYMoved = (y - start.y) / size;

  if (xIndex in nextValue) {
    nextValue[xIndex] = nextValue[xIndex] + relXMoved;
  }

  nextValue[yIndex] = nextValue[yIndex] - relYMoved;

  return nextValue;
}
