import Strategy from './Strategy.class';

export default class Round {
  playedStrategies: Strategy[];
  result: number[];
  pureEquilibrium: boolean;

  constructor(playedStrategies: Strategy[], result: number[], pureEquilibrium = false) {
    this.playedStrategies = playedStrategies.map(s => new Strategy(s.player, s.strategy));
    this.result = result;
    this.pureEquilibrium = pureEquilibrium;
  }
}
