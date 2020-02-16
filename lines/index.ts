import { getDistanceBetweenPoints } from "../points";

export function getLineLength(line) {
  let length = 0;

  for (let i = 0; i < line.length - 1; i++) {
    length += getDistanceBetweenPoints(line[i], line[i + 1])
  }

  return length;
}
