import { Polygon, Point, intersections, Line } from '@mathigon/fermat'

export interface IUserOptions {
  step?: number;
  randomizeStep?: number;
  randomizeAngle?: number;
  randomlyExcludeLines?: boolean;
}

export interface IOptions {
  step: number;
  randomizeStep: number;
  randomizeAngle: number;
  randomlyExcludeLines: boolean;
}

const defaultOptions:IOptions = {
  step: 200,
  randomizeStep: 0,
  randomizeAngle: 0,
  randomlyExcludeLines: false,
}


export function generateDeBruijnGridLines(
  n:number, 
  w:number, 
  h:number, 
  userOptions:IUserOptions = {}
) {
  const options:IOptions = {
    ...defaultOptions,
    ...userOptions,
  };

  const points = [
    new Point(0, 0),
    new Point(w, 0),
    new Point(w, h),
    new Point(0, h),
  ];

  const frame = new Polygon(...points);

  const center = frame.centroid;

  const angleStep = Math.PI * 2 / n;
  const lineLength = w > h ? w * 2 : h * 2;

  const gridLines = [];

  for (let lineIndex = 0; lineIndex < n; lineIndex++) {
    let angle = lineIndex * angleStep;

    if (options.randomizeAngle) {
      const sign = Math.random() > 0.5 ? -1 : 1;

      angle += sign * Math.random() * angleStep * options.randomizeAngle;
    }

    const startPoint = {
      x: center.x + Math.cos(angle + Math.PI / 2) * (options.step / 2),
      y: center.y + Math.cos(angle + Math.PI / 2) * (options.step / 2),
    };

    const x1 = startPoint.x + Math.cos(angle) * lineLength / 2;
    const y1 = startPoint.y + Math.sin(angle) * lineLength / 2;
    const x2 = startPoint.x + Math.cos(angle + Math.PI) * lineLength / 2;
    const y2 = startPoint.y + Math.sin(angle + Math.PI) * lineLength / 2;

    let forwardLine = new Line(
      new Point(x1, y1),
      new Point(x2, y2)
    );
    let backwardLine = new Line(
      new Point(x1, y1),
      new Point(x2, y2)
    );

    const translateForward = new Point(
      Math.cos(angle + Math.PI / 2) * options.step,
      Math.sin(angle + Math.PI / 2) * options.step,
    );
    const translateBackward = new Point(
      Math.cos(angle - Math.PI / 2) * options.step,
      Math.sin(angle - Math.PI / 2) * options.step,
    );

    gridLines[lineIndex] = [];

    let i;

    do {
      i = intersections(frame, forwardLine);

      const includeLine = options.randomlyExcludeLines ? Math.random() > 0.5 : true;
      if (i.length > 1 && includeLine) {
        gridLines[lineIndex].push(i);
      }

      let translate = translateForward;

      if (options.randomizeStep) {
        const randomStep = options.randomizeStep * Math.random();

        translate = translateForward.translate(
          new Point(
            Math.cos(angle + Math.PI / 2) * randomStep,
            Math.sin(angle + Math.PI / 2) * randomStep,
          )
        );
      }

      forwardLine = forwardLine.translate(translate);
    } while (i.length > 1)

    do {
      let translate = translateBackward;

      if (options.randomizeStep) {
        const randomStep = options.randomizeStep * Math.random();

        translate = translateBackward.translate(
          new Point(
            Math.cos(angle + Math.PI / 2) * randomStep,
            Math.sin(angle + Math.PI / 2) * randomStep,
          )
        );
      }

      // Start translating right away, as we already added initial line
      backwardLine = backwardLine.translate(translate);

      i = intersections(frame, backwardLine);

      const includeLine = options.randomlyExcludeLines ? Math.random() > 0.5 : true;
      if (i.length > 1 && includeLine) {
        // Adding lines at the start of the array to keep them sorted
        gridLines[lineIndex].unshift(i);
      }
    } while (i.length > 1);
  }

  return gridLines;
}