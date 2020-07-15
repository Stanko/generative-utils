import { getVector, multiplyVector } from "../vectors";
import { getDistanceBetweenPoints } from "../points";

function random(a, b) {
  return a + Math.random() * (b - a);
}

export default function crappyLine(x1, y1, x2, y2) {
  const p1 = { x: x1, y: y1 };
  const p2 = { x: x2, y: y2 };

  const vector = getVector(p1, p2);
  const distance = getDistanceBetweenPoints(p1, p2);

  const v = multiplyVector(vector, random(0, 0.02));
  let start = {
    x: p1.x + v.x,
    y: p1.y + v.y,
  };

  let d = getDistanceBetweenPoints(p1, start);
  const lines = [];

  while (d < distance) {
    const v1 = multiplyVector(vector, random(0.001, 0.95));

    const end = {
      x: start.x + v1.x,
      y: start.y + v1.y,
    };

    const lineDistance = getDistanceBetweenPoints(start, end);

    if (d + lineDistance <= distance) {
      lines.push([start.x, start.y, end.x, end.y]);

      d += lineDistance;

      const v2 = multiplyVector(vector, random(0.01, 0.06));
      start = {
        x: end.x + v2.x,
        y: end.y + v2.y,
      };

      d += getDistanceBetweenPoints(end, start);
    }
  }

  return lines;
}