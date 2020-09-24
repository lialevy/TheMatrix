import Player from './Player.class';

export default class Strategy {
  player: Player;
  strategy: string | { strategy: string; probability: number }[];

  constructor(player: Player, strategy: string | { strategy: string; probability: number }[]) {
    this.player = player;
    this.strategy = strategy;
  }
}
