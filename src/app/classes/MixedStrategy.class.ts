import Player from './Player.class';
import Strategy from './Strategy.class';

export default class MixedStrategy extends Strategy {
  player: Player;
  strategy: { strategy: string; probability: number }[];
  expectedValue: number;

  constructor(player: Player, strategy: { strategy: string; probability: number }[]) {
    super(player, strategy);
    this.expectedValue = 0;
  }
}
