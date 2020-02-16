export interface IVector {
  x: number,
  y: number,
};

export function addVectors(v1:IVector, v2:IVector):IVector {
  return {
    x: v1.x + v2.x,
    y: v1.y + v2.y,
  };
}

export function multiplyVector(v:IVector, scalar:number):IVector {
  return {
    x: v.x * scalar,
    y: v.y * scalar,
  };
}

export function getVector(v1:IVector, v2:IVector):IVector {
  return {
    x: v2.x - v1.x,
    y: v2.y - v1.y,
  };
}

export function rotateVector(v, angle) {
  return {
    x: v.x * Math.cos(angle) - v.y * Math.sin(angle),
    y: v.x * Math.sin(angle) + v.y * Math.cos(angle),
  };
}

export function compareVectors(v1:IVector, v2:IVector):boolean {
  return v1.x === v2.x && v1.y === v2.y;
}

export function getVectorVelocity(v) {
  const x = -v.x;
  const y = -v.y;

  return Math.sqrt(x * x + y * y);
}