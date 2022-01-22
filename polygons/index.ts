import { getDistanceBetweenPoints, getPointOnLine } from '../points';
import { varyNumber } from '../math';
import {
  getVector,
  getVectorAngle,
  getVectorVelocity,
  IVector,
} from '../vectors';

export function polygonArrayToObject(polygon) {
  return polygon.map((point) => ({ x: point[0], y: point[1] }));
}

export function polygonObjectToArray(polygon) {
  return polygon.map((point) => [point.x, point.y]);
}

export function generateConvexPolygon(
  maxPolygonPoints = 5,
  r = 50,
  center = { x: 100, y: 100 },
  radiusRandomFactor = 0
) {
  const startAngle = Math.random() * Math.PI * 2;

  let angleLeft = Math.PI * 2;
  let totalAngle = startAngle;

  const angles = [startAngle];

  for (let i = maxPolygonPoints; i > 1; i--) {
    const averageAngle = angleLeft / i;
    const angle = averageAngle * 0.4 + 1.1 * Math.random() * averageAngle;

    angleLeft -= angle;
    totalAngle += angle;

    angles.push(totalAngle);
  }

  return angles.map((angle) => {
    let radius = r;

    if (radiusRandomFactor !== 0) {
      const min = 1 - radiusRandomFactor;

      radius = (min + (Math.random() + radiusRandomFactor * 2)) * radius;
    }

    return {
      x: Math.cos(angle) * radius + center.x,
      y: Math.sin(angle) * radius + center.y,
    };
  });
}

export function polygonArea(polygon) {
  let total = 0;

  for (let i = 0, l = polygon.length; i < l; i++) {
    let addX = polygon[i].x;
    let addY = polygon[i == polygon.length - 1 ? 0 : i + 1].y;
    let subX = polygon[i == polygon.length - 1 ? 0 : i + 1].x;
    let subY = polygon[i].y;

    total += addX * addY * 0.5;
    total -= subX * subY * 0.5;
  }

  return Math.abs(total);
}

export function drawPolygon(polygon, drawLine) {
  polygon.forEach((start, index) => {
    const end = polygon[(index + 1) % polygon.length];

    drawLine(start.x, start.y, end.x, end.y);
  });
}

interface IOptions {
  minArea?: number;
  maxArea?: number;
  useVertex?: boolean;
  hackBalance?: boolean;
  randomizeThresholdArea?: number;
  drawLine?: (x1, y1, x2, y2) => void;
}

// TODO rewrite to class
export function cutPolygon(
  polygon,
  thresholdArea = 500,
  userOptions: IOptions = {}
) {
  const options = {
    minArea: 50,
    maxArea: 300,
    useVertex: false,
    hackBalance: false,
    randomizeThresholdArea: 0.3,
    drawLine: (x1, y1, x2, y2) => {},
    ...userOptions,
  };
  const areOfPolygon = polygonArea(polygon);

  if (areOfPolygon < thresholdArea && polygon.length === 4) {
    const d1 = getDistanceBetweenPoints(polygon[0], polygon[2]);
    const d2 = getDistanceBetweenPoints(polygon[1], polygon[3]);

    // Safety check for hackBalance, when one point is duplicated
    if (d1 === 0 || d2 === 0) {
      return;
    }

    let p1 = polygon[0];
    let p2 = polygon[2];

    if (d1 > d2) {
      p1 = polygon[1];
      p2 = polygon[3];
    }

    options.drawLine(p1.x, p1.y, p2.x, p2.y);

    return;
  } else if (polygon.length === 3 && areOfPolygon < thresholdArea / 2) {
    return;
  }

  // Get longest edge
  let edgeOneStartIndex;

  let max = 0;
  for (let i = 0; i < polygon.length; i++) {
    const start = polygon[i];
    const end = polygon[(i + 1) % polygon.length];

    const d = getDistanceBetweenPoints(start, end);
    if (d > max) {
      max = d;
      edgeOneStartIndex = i;
    }
  }

  // Sort polygon to move start of the longest edge to the first place
  polygon = [
    ...polygon.slice(edgeOneStartIndex),
    ...polygon.slice(0, edgeOneStartIndex),
  ];

  const edgeOneStart = polygon[0];
  const edgeOneEnd = polygon[1];

  const point1 = getPointOnLine(
    edgeOneStart,
    edgeOneEnd,
    0.4 + Math.random() * 0.2
  );

  const edgeTwoStartIndex = Math.floor(polygon.length / 2);
  const edgeTwoStart = polygon[edgeTwoStartIndex];
  const edgeTwoEnd = polygon[edgeTwoStartIndex + 1];

  const isOdd = polygon.length % 2 === 1;
  const isEven = polygon.length % 2 === 0;

  const point2 =
    isOdd || options.useVertex
      ? edgeTwoEnd
      : getPointOnLine(edgeTwoStart, edgeTwoEnd, 0.4 + Math.random() * 0.2);

  // Split into two polygons

  // The first polygon takes all points between cut start and cut end
  const polygon1 = polygon.splice(1, edgeTwoStartIndex);

  // Add cut start point
  polygon1.unshift(point1);
  // Add cut end point
  polygon1.push(point2);

  // The second polygon is what is left of the first one:
  const polygon2 = polygon;

  // Insert cut start right after the first point
  // which is the start of the longest edge of the original polygon
  polygon2.splice(1, 0, point1);

  // options.hackBalance still adds a point, even it is not needed
  // this is a bug I made, but I liked the results
  // If I use this approach, I need to delete duplicated lines
  // if (isEven && !options.useVertex) {
  if ((isEven && !options.useVertex) || options.hackBalance) {
    polygon2.splice(2, 0, point2);
  }

  options.drawLine(point1.x, point1.y, point2.x, point2.y);

  let thresholdArea1 = thresholdArea;
  let thresholdArea2 = thresholdArea;

  if (options.randomizeThresholdArea) {
    thresholdArea1 = varyNumber(thresholdArea, options.randomizeThresholdArea);

    if (thresholdArea1 < options.minArea) {
      thresholdArea1 = options.minArea;
    } else if (thresholdArea1 > options.maxArea) {
      thresholdArea1 = options.maxArea;
    }

    thresholdArea2 = varyNumber(thresholdArea, options.randomizeThresholdArea);

    if (thresholdArea2 < options.minArea) {
      thresholdArea2 = options.minArea;
    } else if (thresholdArea2 > options.maxArea) {
      thresholdArea2 = options.maxArea;
    }
  }

  cutPolygon(polygon1, thresholdArea1, options);
  cutPolygon(polygon2, thresholdArea2, options);
}

export function getPolygonCentroid(polygon: IVector[]): IVector {
  const polygonCopy = [...polygon];
  const first = polygonCopy[0];
  const last = polygonCopy[polygonCopy.length - 1];

  if (first.x != last.x || first.y != last.y) {
    polygonCopy.push(first);
  }

  let twicearea = 0;
  let x = 0;
  let y = 0;
  let nPts = polygonCopy.length;
  let p1;
  let p2;
  let f;

  for (var i = 0, j = nPts - 1; i < nPts; j = i++) {
    p1 = polygonCopy[i];
    p2 = polygonCopy[j];
    f = p1.x * p2.y - p2.x * p1.y;
    twicearea += f;
    x += (p1.x + p2.x) * f;
    y += (p1.y + p2.y) * f;
  }

  f = twicearea * 3;

  return { x: x / f, y: y / f };
}

export function rotatePolygon(polygon: IVector[], angle: number): IVector[] {
  const centroid = getPolygonCentroid(polygon);

  return polygon.map((p) => {
    const vector = getVector(centroid, p);
    const r = getVectorVelocity(vector);
    const oldAngle = getVectorAngle(vector);
    const newAngle = oldAngle + angle;

    return {
      x: centroid.x + Math.cos(newAngle) * r,
      y: centroid.y + Math.sin(newAngle) * r,
    };
  });
}

export function movePolygon(polygon: IVector[], vector: IVector): IVector[] {
  return polygon.map((p) => {
    return {
      x: p.x + vector.x,
      y: p.y + vector.y,
    };
  });
}
