import { ExpandedValueType, ValueType } from "../types";

export function bezierCurveParamsFromSizeAndValue(size: number, value: ExpandedValueType) {
  return {
    startCoordinate: getStartPointCoordinate(size, value),
    endCoordinate: getEndPointCoordinate(size, value),
    startBezierHandle: getStartHandleCoordinate(size, value),
    endBezierHandle: getEndHandleCoordinate(size, value),
  };
}

function getStartPointCoordinate(size: number, value: ValueType | ExpandedValueType): null | [number, number] {
  return [0, size * (1 - value[0])];
}

function getStartHandleCoordinate(size: number, value: ValueType | ExpandedValueType): [number, number] {
  return [size * value[1], size * (1 - value[2])];
}

function getEndPointCoordinate(size: number, value: ValueType | ExpandedValueType): null | [number, number] {
  return [size, size * (1 - value[5])];
}

function getEndHandleCoordinate(size: number, value: ValueType | ExpandedValueType): [number, number] {
  return [size * value[3], size * (1 - value[4])];
}
