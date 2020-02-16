// Properties of a line
// I:  - pointA (array) [x,y]: coordinates
//     - pointB (array) [x,y]: coordinates
// O:  - (object) { length: l, angle: a }: properties of the line
const getAngle = (pointA, pointB) => {
  const lengthX = pointB.x - pointA.x
  const lengthY = pointB.y - pointA.y

  return Math.atan2(lengthY, lengthX);
}

function getDistanceBetweenPoints(v1, v2) {
  const x = v1.x - v2.x;
  const y = v1.y - v2.y;

  return Math.sqrt(x * x + y * y);
}

function getVector(a, b) {
  return {
    x: a.x - b.x,
    y: a.y - b.y
  };
}

function getVectorVelocity(v) {
  const x = -v.x;
  const y = -v.y;

  return Math.sqrt(x * x + y * y);
}


// Position of a control point
const controlPoint = (previous, current, next, length = null, reverse = false) => {

  // When 'current' is the first or last point of the array
  // 'previous' or 'next' don't exist.
  // Replace with 'current'
  const p = previous || current;
  const n = next || current;

  // If is end-control-point, add PI to the angle to go backward
  const angle = getAngle(p, n) + (reverse ? Math.PI : 0);

  // The control point position is relative to the current point
  const x = current.x + Math.cos(angle) * length;
  const y = current.y + Math.sin(angle) * length;

  return { x, y }
}

const getBezier = (line, index, smoothing, shouldClose) => {
  const current = line[index];
  const prevPrev = line[(line.length + index - 2) % line.length];
  const prev = line[(line.length + index - 1) % line.length];
  const next = line[(line.length + index + 1) % line.length];

  const length = getDistanceBetweenPoints(prev, current) * smoothing;

  // start control point
  let cps = controlPoint(prevPrev, prev, current, length);

  // end control point
  let cpe = controlPoint(prev, current, next, length, true);

  if (!shouldClose) {
    if (index === 1) {
      const v = getVector(prev, cpe);
      const d = getVectorVelocity(v);
      cps = {
        x: prev.x + (v.x / -d * length),
        y: prev.y + (v.y / -d * length),
      };
    } else if (index === line.length - 1) {
      const v = getVector(current, cps);
      const d = getVectorVelocity(v);
      cpe = {
        x: current.x + (v.x / -d * length),
        y: current.y + (v.y / -d * length),
      };
    }
  }

  return `C ${ cps.x },${ cps.y } ${ cpe.x },${ cpe.y } ${ current.x },${ current.y } `;
}

export default function smoothLine(line, smoothing = 0.25, shouldClose = false) {
  let d = `M ${ line[0].x } ${ line[0].y }`;

  for (let i = 1; i < line.length; i++) {
    d += getBezier(line, i, smoothing, shouldClose);
  }

  if (shouldClose) {
    d += getBezier(line, 0, smoothing, shouldClose);
    return `${ d } Z`
  }

  return d;
}
