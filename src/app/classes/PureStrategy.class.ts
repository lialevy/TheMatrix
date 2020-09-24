import Player from './Player.class';
import Strategy from './Strategy.class';

export default class PureStrategy extends Strategy {
  player: Player;
  strategy: string;

  constructor(player: Player, strategy: { strategy: string; probability: number }[]) {
    super(player, strategy);
  }
}
