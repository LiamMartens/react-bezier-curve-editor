import { ExpandedValueType, ValueType } from "../types";

export function bezierCurveParamsFromSizeAndValue(size: number, value: ExpandedValueType) {
  return {
    startCoordinate: getStartPointCoordinate(size, value),
    endCoordinate: getEndPointCoordinate(size, value),
    startBezierHandle: getStartHandleCoordinate(size, value),
    endBezierHandle: getEndHandleCoordinate(size, value),
  };
}

function getStartPointCoordinate(size: number, value: ValueType | ExpandedValueType): [number, number] {
  return [size * value[0], size * (1 - value[1])];
}

function getStartHandleCoordinate(size: number, value: ValueType | ExpandedValueType): [number, number] {
  return [size * value[2], size * (1 - value[3])];
}

function getEndPointCoordinate(size: number, value: ValueType | ExpandedValueType): [number, number] {
  return [size * value[6], size * (1 - value[7])];
}

function getEndHandleCoordinate(size: number, value: ValueType | ExpandedValueType): [number, number] {
  return [size * value[4], size * (1 - value[5])];
}
