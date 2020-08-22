
export default abstract class Matrix {
  playersStrategies?: string[][];
  paymentsMatrix?: any;

  abstract flatten(): { strategies: string[], payoff: number[] }[];
}
