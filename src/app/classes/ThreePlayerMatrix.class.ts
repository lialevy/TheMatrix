export default class ThreePlayerMatrix {
  playersStrategies?: string[][];
  paymentsMatrix?: {
    [firstStrategy: string]: {
      [secondStrategy: string]: {
        [thirdStrategy: string]: [number, number, number];
      };
    };
  };

  flatten(): { strategies: string[], payoff: number[] }[] {
    const [p1Strategies, p2Strategies, p3Strategies] = this.playersStrategies;

    const flattenedMatrix = [];

    for (const s1 of p1Strategies) {
      for (const s2 of p2Strategies) {
        for (const s3 of p3Strategies) {
          flattenedMatrix.push({
            strategies: [s1, s2, s3],
            payoff: this.paymentsMatrix[s1][s2][s3]
          });
        }
      }
    }

    return flattenedMatrix;
  }
}
