import Matrix from './Matrix.class';

export default class TwoPlayerMatrix extends Matrix {
  playersStrategies?: string[][];
  paymentsMatrix?: {
    [firstStrategy: string]: {
      [secondStrategy: string]: [number, number];
    };
  };

  flatten(): { strategies: string[]; payoff: number[] }[] {
    const [p1Strategies, p2Strategies] = this.playersStrategies;

    const flattenedMatrix = [];

    for (const s1 of p1Strategies) {
      for (const s2 of p2Strategies) {
        flattenedMatrix.push({
          strategies: [s1, s2],
          payoff: this.paymentsMatrix[s1][s2],
        });
      }
    }

    return flattenedMatrix;
  }
}
