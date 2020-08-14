import Strategy from './Strategy.class';

export default class Round {
  playedStrategies: Strategy[];
  result: number[];

  constructor(playedStrategies: Strategy[], result: number[]) {
    this.playedStrategies = playedStrategies.map(s => new Strategy(s.player, s.strategy));
    this.result = result;
  }
}
