interface IItemWithProbability {
  probability: number;
  value: any;
}

export function randomItemWithProbability(originalData:IItemWithProbability[], rng:() => number = Math.random) {
  const total = originalData.reduce((acc, current) => acc + current.probability, 0);

  let currentProbability = 0;
  const data = originalData.map(item => {
    const probability = item.probability / total;
    currentProbability += probability;

    return currentProbability;
  });

  const randomValue = rng();

  for (let i = 0; i < data.length; i++) {
    if (randomValue < data[i]) {
      return originalData[i].value;
    }
  }

  throw new Error('this should not happen');
}
