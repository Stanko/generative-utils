import { getDistanceBetweenPoints } from "../points";
import { Line, Point } from "@mathigon/fermat";
import { IVector } from "../vectors";

export function getLineLength(line) {
  let length = 0;

  for (let i = 0; i < line.length - 1; i++) {
    length += getDistanceBetweenPoints(line[i], line[i + 1])
  }

  return length;
}

export function getPerpendicularLine(p1:IVector, p2:IVector) {
  const line = new Line(
    new Point(p1.x, p1.y),
    new Point(p2.x, p2.y),
  );

  return {
    x: line.perpendicularVector.x,
    y: line.perpendicularVector.y
  };
}
export function getUnitVector(p1:IVector, p2:IVector) {
  const line = new Line(
    new Point(p1.x, p1.y),
    new Point(p2.x, p2.y),
  );

  return {
    x: line.unitVector.x,
    y: line.unitVector.y
  };
}