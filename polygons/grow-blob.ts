import { getDistanceBetweenPoints, getPointOnLine } from "../points"
import { varyNumber, normalDistribution } from "../math";
import { Gaussian } from "../math/gaussian";
import { IVector, getVector, getVectorAngle} from "../vectors";


// TODO play with params and distribution
export function growBlob(
  polygon:IVector[],
  factor:number = 0.3,
) {
  const newPolygon = [];

  const pointDistribution = new Gaussian(0.5, 0.2);
  const angleDistribution = new Gaussian(0.5, 0.2);
  const lengthDistribution = new Gaussian(0.5, 0.2);

  polygon.forEach((currentPoint, i) => {
    const nextPoint = polygon[(i + 1) % polygon.length];

    const f = currentPoint.factor || factor;

    const pointLocation = pointDistribution.get();
    const angle = getVectorAngle(getVector(nextPoint, currentPoint)) + angleDistribution.get() * Math.PI;
    const length = getDistanceBetweenPoints(currentPoint, nextPoint) * f * lengthDistribution.get();

    const startPoint = getPointOnLine(currentPoint, nextPoint, pointLocation);
    const endPoint = {
      x: startPoint.x + Math.cos(angle) * length,
      y: startPoint.y + Math.sin(angle) * length,
      factor: varyNumber(f, 0.5),
    };
    
    newPolygon.push({
      ...currentPoint,
      factor,
    });
    newPolygon.push(endPoint);
  });

  return newPolygon;
}