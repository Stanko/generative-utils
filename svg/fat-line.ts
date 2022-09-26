import smoothLine from './smooth-line';
import { rotateVector, getVectorVelocity, getVector } from '../vectors';
import { getAngleBetweenThreeDots, getDistanceBetweenPoints } from '../points';
import { getLineLength } from '../lines';

export interface IVector {
  x: number;
  y: number;
}

// Takes three dots and returns two dots,
// a vector which direction is half angle between these three dots
// and velocity is equal to a spiral line's width at that dot
/*
                          • outerDots[0]
                         /
                        /
    previousDot •------• dot
                      / \
                     /   • nextDot
       outerDots[1] •
  */
function getOuterDots(previousDot, dot, nextDot, width) {
  // If width is zero, we are returning the middle dot twice
  if (width === 0) {
    return [{ ...dot }, { ...dot }];
  }

  const halfWidth = width / 2;

  if (previousDot === null || nextDot === null) {
    let v;

    if (previousDot === null) {
      v = getVector(nextDot, dot);
    } else {
      v = getVector(dot, previousDot);
    }

    const d = getVectorVelocity(v);
    v = {
      x: (v.x / d) * halfWidth,
      y: (v.y / d) * halfWidth,
    };

    const v1 = rotateVector(v, Math.PI / -2);
    const v2 = rotateVector(v, Math.PI / 2);

    const point1 = {
      x: dot.x + v1.x,
      y: dot.y + v1.y,
    };
    const point2 = {
      x: dot.x + v2.x,
      y: dot.y + v2.y,
    };

    return [point1, point2];
  }

  // Angle between (previosDot, dot) vector and x axis
  /*
  previousDot •------• dot
             angle1 / \
                   /   • nextDot
  */
  let angle1 = getAngleBetweenThreeDots(previousDot, dot, nextDot) / 2;

  // Angle between (previosDot, dot) vector and x axis
  /*
               dot •--------• (dot.x + 100, dot.y)
                  / angle2
                 /
    previousDot •
  */
  let offset = 100;
  if (angle1 > 0) {
    offset = -100;
  }
  const angle2 = getAngleBetweenThreeDots(previousDot, dot, {
    x: dot.x + offset, // Moving dot on x axis
    y: dot.y,
  });

  // Angle between the x axis and the half angle vector
  const angle = angle2 - angle1;

  const point1 = {
    x: dot.x + halfWidth * Math.cos(angle),
    y: dot.y - halfWidth * Math.sin(angle),
  };

  const point2 = {
    x: dot.x + halfWidth * Math.cos(angle + Math.PI),
    y: dot.y - halfWidth * Math.sin(angle + Math.PI),
  };

  const outerDots = [point1, point2];

  return outerDots;
}

export function fatLine(
  line: IVector[],
  lineWidthFn: (x, totalLength, nodeIndex) => number = (x, _) => x * 30,
  smoothing: number = 0.25,
  getDataOnly = false
) {
  // Setting starting dot, based on "startingRadius"
  // Spiral always starts from PI angle, that's why it's moved to the "right"
  // (in other words, adding "r" to the "x" axis coordinate)
  // while keeping y coordinate centered
  const pathOuter = [];
  const pathInner = [];

  let currentLength = 0;
  const lineLength = getLineLength(line);

  // We need three dots to draw a bezier,
  // that's why loop starts from 1 and ends on length - 1
  for (let i = 0; i < line.length; i++) {
    const previousDot = line[i - 1] || null;
    const currentDot = line[i];
    const nextDot = line[i + 1] || null;

    const od = getOuterDots(
      previousDot,
      currentDot,
      nextDot,
      lineWidthFn(currentLength / lineLength, lineLength, i)
    );

    if (line[i + 1]) {
      currentLength += getDistanceBetweenPoints(line[i], line[i + 1]);
    }

    pathOuter.push(od[0]);
    pathInner.push(od[1]);
  }

  if (getDataOnly) {
    return {
      path1: pathOuter,
      path2: pathInner,
    };
  }

  const outerLine = smoothLine(pathOuter, smoothing);
  const innerLine = smoothLine(pathInner.reverse(), smoothing).replace(
    'M',
    'L'
  );

  return `${outerLine} ${innerLine} Z`;
}
