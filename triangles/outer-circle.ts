import { IVector } from "../vectors";

export function outerCircle(p1:IVector, p2:IVector, p3:IVector) {
  const x12 = p1.x - p2.x;
  const x13 = p1.x - p3.x;

  const y12 = p1.y - p2.y;
  const y13 = p1.y - p3.y;

  const y31 = p3.y - p1.y;
  const y21 = p2.y - p1.y;

  const x31 = p3.x - p1.x;
  const x21 = p2.x - p1.x;

  // x1^2 - x3^2
  const sx13 = p1.x * p1.x - p3.x * p3.x;

  // y1^2 - y3^2
  const sy13 = p1.y * p1.y - p3.y * p3.y;

  const sx21 = p2.x * p2.x - p1.x * p1.x;
  const sy21 = p2.y * p2.y - p1.y * p1.y;

  const f = (sx13 * x12 + sy13 * x12 + sx21 * x13 + sy21 * x13) / (2 * (y31 * x12 - y21 * x13));
  const g = (sx13 * y12 + sy13 * y12 + sx21 * y13 + sy21 * y13) / (2 * (x31 * y12 - x21 * y13));

  const c = -p1.x * p1.x - p1.y * p1.y - 2 * g * p1.x - 2 * f * p1.y;

  // eqn of circle be x^2 + y^2 + 2*g*x + 2*f*y + c = 0
  // where centre is (h = -g, k = -f) and radius r
  // as r^2 = h^2 + k^2 - c
  const h = -g;
  const k = -f;
  const rSquared = h * h + k * k - c;

  // r is the radius
  const r = Math.sqrt(rSquared);

  return {
    center: {
      x: h,
      y: k
    },
    r
  };
}