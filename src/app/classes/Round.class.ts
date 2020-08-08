import { Strategy } from '../services/game-service.interface';

export default class Round {
  playedStrategies: Strategy[];
  result: number[];

  constructor(playedStrategies: Strategy[], result: number[]) {
    this.playedStrategies = playedStrategies;
    this.result = result;
  }
}
