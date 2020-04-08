import { Polygon, Point, intersections, Line } from '@mathigon/fermat'
import { IVector } from '../vectors';
import { getPointOnLine } from '../points';
import { getLineLength } from '../lines';

interface IUserOptions {
  angle?: number;
  step?: number;
  lineLength?: number;
  randomizePosition?: number;
  bezier?: number;
  bezierLengthFactor?: number;
}

interface IOptions {
  angle: number;
  step: number;
  lineLength: number;
  randomizePosition: number;
  bezier: number;
  bezierLengthFactor: number;
}

const defaultOptions:IOptions = {
  angle: Math.PI / 2,
  step: 3,
  lineLength: 1000,
  randomizePosition: 3,
  bezier: 0,
  bezierLengthFactor: 30,
}

export function lineFill(
  userPolygon:IVector[], 
  userOptions:IUserOptions = {}
) {

  const options:IOptions = {
    ...defaultOptions,
    ...userOptions,
  };

  const points = userPolygon.map(p => {
    return new Point(p.x, p.y);
  });

  const polygon = new Polygon(...points);

  const c = polygon.centroid;

  const x1 = c.x + Math.cos(options.angle) * options.lineLength / 2;
  const y1 = c.y + Math.sin(options.angle) * options.lineLength / 2;
  const x2 = c.x + Math.cos(options.angle + Math.PI) * options.lineLength / 2;
  const y2 = c.y + Math.sin(options.angle + Math.PI) * options.lineLength / 2;

  let forwardLine = new Line(
    new Point(x1, y1),
    new Point(x2, y2)
  );
  let backwardLine = new Line(
    new Point(x1, y1),
    new Point(x2, y2)
  );

  const translateForward = new Point(
    Math.cos(options.angle + Math.PI / 2) * options.step,
    Math.sin(options.angle + Math.PI / 2) * options.step,
  );
  const translateBackward = new Point(
    Math.cos(options.angle - Math.PI / 2) * options.step,
    Math.sin(options.angle - Math.PI / 2) * options.step,
  );

  let lines = [];

  let i;
  do {
    i = intersections(polygon, forwardLine);

    if (i.length > 1) {
      lines.push(i);
    }

    forwardLine = forwardLine.translate(translateForward);
  } while (i.length > 1)

  do {
    // Start translating right away, as we already added initial line
    backwardLine = backwardLine.translate(translateBackward);

    i = intersections(polygon, backwardLine);

    if (i.length > 1) {
      // Adding lines at the start of the array to keep them sorted
      lines.unshift(i);
    }
  } while (i.length > 1)

  if (options.randomizePosition) {
    lines = lines.map(l => {
      const x1Sign = Math.random() > 0.5 ? -1 : 1;
      const y1Sign = Math.random() > 0.5 ? -1 : 1;
      const x2Sign = Math.random() > 0.5 ? -1 : 1;
      const y2Sign = Math.random() > 0.5 ? -1 : 1;

      return [
        {
          x: l[0].x + x1Sign * Math.random() * options.randomizePosition,
          y: l[0].y + y1Sign * Math.random() * options.randomizePosition,
        },
        {
          x: l[1].x + x2Sign * Math.random() * options.randomizePosition,
          y: l[1].y + y2Sign * Math.random() * options.randomizePosition,
        }
      ];
    });
  }

  if (options.bezier) {
    lines = lines.map(l => {
      const x1Sign = Math.random() > 0.5 ? -1 : 1;
      const y1Sign = Math.random() > 0.5 ? -1 : 1;
      const x2Sign = Math.random() > 0.5 ? -1 : 1;
      const y2Sign = Math.random() > 0.5 ? -1 : 1;

      const c1 = getPointOnLine(l[0], l[1], 0.1 + Math.random() * 0.4);
      const c2 = getPointOnLine(l[0], l[1], 0.5 + Math.random() * 0.4);

      const bezierFactor = getLineLength(l) / options.bezierLengthFactor * options.bezier;

      return [
        // first point
        l[0],
        // first control point
        {
          x: c1.x + x1Sign * Math.random() * bezierFactor,
          y: c1.y + y1Sign * Math.random() * bezierFactor,
        },
        // second control point
        {
          x: c2.x + x2Sign * Math.random() * bezierFactor,
          y: c2.y + y2Sign * Math.random() * bezierFactor,
        },
        // second point
        l[1],
      ];
    });
  }

  return lines;
}