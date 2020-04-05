import { IVector} from "../vectors";
import { getIntersection } from "../lines/get-intersection";

export function getInnerPolygon(
  polygon:IVector[],
) {
  if (polygon.length < 5) {
    console.error('Polygon needs to have at least 5 points');
    return;
  }

  const newPolygon = []

  for (let i = 0; i < polygon.length; i++) {
    const s1 = polygon[i % polygon.length];
    const e1 = polygon[(i + 2) % polygon.length];

    const s2 = polygon[(polygon.length + i - 1) % polygon.length];
    const e2 = polygon[(i + 1) % polygon.length];

    const p = getIntersection(s1, e1, s2, e2);

    newPolygon.push(p);
  } 


  return newPolygon;
}