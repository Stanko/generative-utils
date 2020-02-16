// Standard Normal variate using Box-Muller transform.
export function normalDistribution(rng = Math.random) {
  let u = 0;
  let v = 0;

  while (u === 0) {
    u = rng(); // Converting [0,1) to (0,1)
  }

  while (v === 0) {
    v = rng();
  }

  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);

  num = num / 10.0 + 0.5; // Translate to 0 -> 1

  if (num > 1 || num < 0) {
    return normalDistribution(); // resample between 0 and 1
  }

  return num;
}


export function varyNumber(n, max = 0.3) {
  return n * (1 - max) + (max * 2) * n * Math.random();
}

export function toFixed(number:number, numberOfDecimalSpaces:number = 2):number {
  return parseFloat(number.toFixed(numberOfDecimalSpaces));
}

export function mapRange(value:number, inputRange:number, outputMin:number, outputMax:number) {
  const outputRange = outputMax - outputMin;

  return value / inputRange * outputRange + outputMin;
}
