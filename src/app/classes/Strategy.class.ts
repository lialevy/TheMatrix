import Player from './Player.class';

export default class Strategy {
  player: Player;
  strategy: string;

  constructor(player: Player, strategy: string) {
    this.player = player;
    this.strategy = strategy;
  }
}
