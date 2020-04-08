import { getAngleBetweenThreeDots } from "../points";
import { intersections, Line, Point } from '@mathigon/fermat'

function getIntersection(px1, py1, px2, py2, px3, py3, px4, py4) {
  const line1 = new Line(new Point(px1, py1), new Point(px2, py2));
  const line2 = new Line(new Point(px3, py3), new Point(px4, py4));
  
  return intersections(line1, line2);
}

function compareWithEpsilon(a, b, epsilon = 0.1) {
  return Math.abs(a - b) <= epsilon
}

export function getRhombusOnIntersection(px1, py1, px2, py2, px3, py3, px4, py4, rhombusSideLength) {
  const intersect = getIntersection(px1, py1, px2, py2, px3, py3, px4, py4);

  if (intersect.length === 0) {
    console.warn('Lines are not intersecting');
    return null;
  }

  const x = intersect[0].x;
  const y = intersect[0].y;

  // TODO 
  // FIX
  // if intersection is on one of the lines
  // getAngleBetweenThreeDots returns 180 and calculations fail

  const pointToCompareOnLine1 = {
    x: px1,
    y: py1,
  };

  if (compareWithEpsilon(x, px1) && compareWithEpsilon(y, py1)) {
    pointToCompareOnLine1.x = px2;
    pointToCompareOnLine1.y = py2;
  }

  const pointToCompareOnLine2 = {
    x: px3,
    y: py3,
  };

  if (compareWithEpsilon(x, px3) && compareWithEpsilon(y, py3)) {
    pointToCompareOnLine2.x = px4;
    pointToCompareOnLine2.y = py4;
  }

  const angleBetweenLineAndZero = getAngleBetweenThreeDots(
    pointToCompareOnLine2,
    { x, y },
    { x: x + 100, y },
  );
  const angleBetweenLines = getAngleBetweenThreeDots(
    pointToCompareOnLine1,
    { x, y },
    pointToCompareOnLine2
  );

  if (angleBetweenLines === Math.PI || angleBetweenLines === 0) {
    console.log('-------------------');
    console.log(angleBetweenLines, x, y)
    console.log(arguments)
    return;
  }

  const angle1 = Math.PI - angleBetweenLineAndZero
  const angle2 = Math.PI - angleBetweenLines - angleBetweenLineAndZero;

  const r = (rhombusSideLength * Math.sin(Math.abs(angleBetweenLines))) / 2; //  || side;
  
  const testLineLength = rhombusSideLength * 100;

  const x11 = x + Math.cos(angle1) * r;
  const y11 = y + Math.sin(angle1) * r;
  const x12 = x + Math.cos(angle1 + Math.PI) * r;
  const y12 = y + Math.sin(angle1 + Math.PI) * r;

  const a1 = angle1 + Math.PI / 2;  

  const x21 = x + Math.cos(angle2) * r;
  const y21 = y + Math.sin(angle2) * r;
  const x22 = x + Math.cos(angle2 + Math.PI) * r;
  const y22 = y + Math.sin(angle2 + Math.PI) * r;

  const a2 = angle2 + Math.PI / 2;  

  const ax = x11 + Math.cos(a1) * testLineLength
  const ay = y11 + Math.sin(a1) * testLineLength;
  const bx = x11 + Math.cos(a1 + Math.PI) * testLineLength;
  const by = y11 + Math.sin(a1 + Math.PI) * testLineLength;
  
  const cx = x12 + Math.cos(a1) * testLineLength
  const cy = y12 + Math.sin(a1) * testLineLength;
  const dx = x12 + Math.cos(a1 + Math.PI) * testLineLength;
  const dy = y12 + Math.sin(a1 + Math.PI) * testLineLength;
  
  
  const mx = x21 + Math.cos(a2) * testLineLength
  const my = y21 + Math.sin(a2) * testLineLength;
  const nx = x21 + Math.cos(a2 + Math.PI) * testLineLength;
  const ny = y21 + Math.sin(a2 + Math.PI) * testLineLength;
  
  const jx = x22 + Math.cos(a2) * testLineLength
  const jy = y22 + Math.sin(a2) * testLineLength;
  const kx = x22 + Math.cos(a2 + Math.PI) * testLineLength;
  const ky = y22 + Math.sin(a2 + Math.PI) * testLineLength;
 
  const p1 = getIntersection(ax, ay, bx, by, mx, my, nx, ny)[0];
  const p2 = getIntersection(ax, ay, bx, by, jx, jy, kx, ky)[0];
  const p3 = getIntersection(cx, cy, dx, dy, jx, jy, kx, ky)[0];
  const p4 = getIntersection(cx, cy, dx, dy, mx, my, nx, ny)[0];
  

  if (!p1) {
    console.log('------------- no p1')
    console.log(arguments);
    return null;
  }

  let rhombus = [p1, p2, p3, p4];

  let area = 0;

  for (let i = 0; i < rhombus.length; i++) {
    let j = (i + 1) % rhombus.length;
    area += rhombus[i].x * rhombus[j].y;
    area -= rhombus[j].x * rhombus[i].y;
  }

  area = area / 2;

  const isClockwisePolygon = area > 0;

  // Make sure all polygons are oriented in the same way
  if (isClockwisePolygon) {
    rhombus = [p4, p3, p2, p1];
  }

  return {
    r: rhombus,
    center: { x, y },
  };
}