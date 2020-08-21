import Player from './Player.class';

export default class MixedStrategy {
  player: Player;
  strategy: { strategy: string, probability: number }[];
  expectedValue: number;

  constructor(player: Player, strategy: { strategy: string, probability: number }[]) {
    this.player = player;
    this.strategy = strategy;
    this.expectedValue = 0;
  }
}
