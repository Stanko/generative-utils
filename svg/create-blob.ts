import smoothLine from './smooth-line';

export default function createBlob(
  n:number = 5,
  r:number = 50,
  center = { x: 0, y: 0 },
  innerRadiusFactor: number = 0.9,
  smoothing:number = 0.25
) {
  const startAngle = Math.random() * Math.PI * 2;

  const k = n * 2;

  let angleLeft = Math.PI * 2;
  let totalAngle = startAngle;

  const angles = [startAngle];

  for (let i = k; i > 1; i--) {
    const averageAngle = angleLeft / i;
    const angle = averageAngle * 0.4 + 1.1 * Math.random() * averageAngle;

    angleLeft -= angle;
    totalAngle += angle;

    angles.push(totalAngle);
  }

  const polygon = angles.map((angle, index) => {
    const radius = index % 2 === 0 ? 
      r * (0.9 + Math.random() * 0.2) : 
      r * (innerRadiusFactor - Math.random() * 0.1);

    return {
      x: Math.cos(angle) * radius + center.x,
      y: Math.sin(angle) * radius + center.y,
    };
  });

  return {
    polygon,
    d: smoothLine(polygon, smoothing, true),
  };
}