import { IVector } from "../vectors";
import { Point, Line, intersections } from '@mathigon/fermat'

export function scalePolygon(polygon:IVector[], padding:number) {
  return polygon.map((current, index) => {
    const previous = polygon[(index - 1 + polygon.length) % polygon.length];
    const next = polygon[(index + 1) % polygon.length];

    const edge1 = new Line(
      new Point(previous.x, previous.y),
      new Point(current.x, current.y)
    );
    const edge2 = new Line(
      new Point(current.x, current.y), 
      new Point(next.x, next.y)
    );

    const e1 = edge1.translate(edge1.perpendicularVector.scale(padding));
    const e2 = edge2.translate(edge2.perpendicularVector.scale(padding));

    const newPoint = intersections(e1, e2)[0];

    return newPoint;
  });
}