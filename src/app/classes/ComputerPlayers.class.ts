import { uniqueNamesGenerator, starWars } from 'unique-names-generator';
import { Matrix } from '.';
import Player from './Player.class';
import PlayerType from './PlayerType.enum';

export default abstract class ComputerPlayer extends Player {
  playerNumber: 0 | 1 | 2;
  name?: string;
  cookies: number;
  type = undefined;
  strategy: string;

  constructor(playerNumber: 0 | 1 | 2, name?: string, cookies: number = 0) {
    super(playerNumber, name, cookies);

    this.name = uniqueNamesGenerator({ dictionaries: [starWars], length: 1 });
  }

  finalize(matrix: Matrix): void {}
  abstract play(possibleStrategies?: string[]): string;
}

export class RandomComputerPlayer extends ComputerPlayer {
  type = PlayerType.Random;

  constructor(playerNumber: 0 | 1 | 2, name?: string, cookies: number = 0) {
    super(playerNumber, name, cookies);
  }

  play(possibleStrategies?: string[]): string {
    const randomStrategyIndex = Math.ceil(Math.random() * possibleStrategies.length) - 1;

    return possibleStrategies[randomStrategyIndex];
  }
}

export class MinMaxComputerPlayer extends ComputerPlayer {
  type = PlayerType.MinMax;

  constructor(playerNumber: 0 | 1 | 2, name?: string, cookies: number = 0) {
    super(playerNumber, name, cookies);
  }

  finalize(matrix: Matrix): void {
    const maxValues = [];
    const myStrategies = matrix.playersStrategies[this.playerNumber];
    const flattenedMatrix = matrix.flatten();

    for (const strategy of myStrategies) {
      maxValues.push({
        strategy,
        value: flattenedMatrix
          .filter((possibleOutcome) =>
            possibleOutcome.strategies.includes(strategy)
          )
          .map((po) => po.payoff[this.playerNumber]).reduce(
            (prev, curr) => (prev && prev >= curr ? prev : curr)
          ),
      });
    }

    const { strategy: minMaxStrategy } = maxValues.reduce<{ strategy: string; value: number; }>(
      (prev, curr) => (prev && prev.value <= curr.value ? prev : curr),
      undefined
    );

    this.strategy = minMaxStrategy;
  }

  play(): string {
    return this.strategy;
  }
}

export class MaxMinComputerPlayer extends ComputerPlayer {
  type = PlayerType.MaxMin;

  constructor(playerNumber: 0 | 1 | 2, name?: string, cookies: number = 0) {
    super(playerNumber, name, cookies);
  }

  finalize(matrix: Matrix): void {
    const maxValues = [];
    const myStrategies = matrix.playersStrategies[this.playerNumber];
    const flattenedMatrix = matrix.flatten();

    for (const strategy of myStrategies) {
      maxValues.push({
        strategy,
        value: flattenedMatrix
          .filter((possibleOutcome) =>
            possibleOutcome.strategies.includes(strategy)
          )
          .map((po) => po.payoff[this.playerNumber]).reduce(
            (prev, curr) => (prev && prev <= curr ? prev : curr)
          ),
      });
    }

    const { strategy: maxMinStrategy } = maxValues.reduce<{ strategy: string; value: number; }>(
      (prev, curr) => (prev && prev.value >= curr.value ? prev : curr),
      undefined
    );

    this.strategy = maxMinStrategy;
  }

  play(): string {
    return this.strategy;
  }
}
