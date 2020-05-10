import inside from "robust-point-in-polygon";
import { multiplyVector, getVector, addVectors, IVector } from "../vectors";
import { polygonObjectToArray } from "../polygons";

export function getDistanceBetweenPoints(v1:IVector, v2:IVector):number {
  const x = v1.x - v2.x;
  const y = v1.y - v2.y;

  return Math.sqrt(x * x + y * y);
}


export function isPointInCircle(point:IVector, circleCenter:IVector, radius:number):boolean {
  const x = point.x - circleCenter.x;
  const y = point.y - circleCenter.y;

  return x * x + y * y < radius * radius;
}

export function isPointInPolygon(point:IVector, polygon:IVector[]) {
  const isInside = inside(polygonObjectToArray(polygon), [point.x, point.y]);

  if (isInside === 0) {
    return 'EDGE';
  }
  
  if (isInside === -1) {
    return 'INSIDE';
  }

  return false;
}

export function isPolygonInPolygon(innerPolygon:IVector[], polygon:IVector[]) {
  for (let i = 0; i < innerPolygon.length; i++) {
    const point = innerPolygon[i];

    if (!isPointInPolygon(point, polygon)) {
      return false;
    }
  }

  return true;
}

export function getPointOnLine(start:IVector, end:IVector, position:number = null):IVector {
  if (position === null) {
    position = Math.random()
  } else if (position === 0) {
    return { ...start };
  } else if (position === 1) {
    return { ...end };
  }

  const vector = multiplyVector(getVector(start, end), position);
  
  return addVectors(start, vector);
}


export function getAngleBetweenThreeDots(a, b, c) {
  const vectorBA = getVector(b, a);
  const vectorBC = getVector(b, c);

  const angle =
    Math.atan2(vectorBC.y, vectorBC.x) - Math.atan2(vectorBA.y, vectorBA.x);

  return angle;
}

export function getPointOnEllipse(center, a, b, angle) {
  const sign = 
    (angle >= 0 && angle <= Math.PI / 2) || // Do I need <= ?
    (angle > Math.PI * 1.5 && angle <= Math.PI * 2)
    ? 1 : - 1;

  const x = center.x + sign * (a * b / Math.sqrt(b * b + a * a * (Math.tan(angle) * Math.tan(angle))));

  const y = center.y + sign * (a * b * Math.tan(angle) / Math.sqrt(b * b + a * a * (Math.tan(angle) * Math.tan(angle))));

  return {
    x,
    y,
  }
}