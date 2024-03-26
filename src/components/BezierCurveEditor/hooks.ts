import React from "react";
import { Point } from "./BezierCurveEditor";
import { ExpandedValueType } from "../../types";

export function useHandleState(
  moveHandle: (start: Point, coordinates: Point) => void,
  handleMoveStart: () => void
): [
  boolean,
  Record<
    "handlePointerLeaveOrUp" | "handlePointerMove" | "handlePointerStartMoving",
    React.PointerEventHandler<HTMLButtonElement>
  >
] {
  const handlePositionRef = React.useRef<Point>({ x: 0, y: 0 });
  const [movingHandle, setMovingHandle] = React.useState(false);

  const handlePointerStartMoving = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (movingHandle) return;

      event.preventDefault();

      setMovingHandle(true);
      handleMoveStart();
      const startX = event.clientX;
      const startY = event.clientY;
      handlePositionRef.current = { x: startX, y: startY };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [movingHandle, handleMoveStart]
  );

  const handlePointerMove = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      if (movingHandle) {
        const x = event.clientX;
        const y = event.clientY;
        moveHandle(handlePositionRef.current, { x, y });
      }
    },
    [moveHandle, movingHandle]
  );

  const handlePointerLeaveOrUp = React.useCallback(
    (event: React.PointerEvent<HTMLButtonElement>) => {
      event.currentTarget.releasePointerCapture(event.pointerId);
      setMovingHandle(false);
    },
    [setMovingHandle]
  );

  return [movingHandle, { handlePointerLeaveOrUp, handlePointerMove, handlePointerStartMoving }];
}
