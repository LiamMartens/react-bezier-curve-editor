import { ValueType } from "../types";

export function bezierCurveParamsFromSizeAndValue(size: number, value: ValueType) {
  const startCoordinate = [0, size];
  const endCoordinate = [size, 0];
  const startBezierHandle = [size * value[0], size * (1 - value[1])];
  const endBezierHandle = [size * value[2], size * (1 - value[3])];
  return {
    startCoordinate,
    endCoordinate,
    startBezierHandle,
    endBezierHandle,
  };
}
