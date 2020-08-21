import Game from './Game.class';
import TwoPlayerGame, { TwoPlayerMatrix } from './TwoPlayerGame.class';
import ThreePlayerGame, { ThreePlayerMatrix } from './ThreePlayerGame.class';
import Player from './Player.class';
import Round from './Round.class';
import Strategy from './Strategy.class';
import MixedStrategy from './MixedStrategy.class';

type Matrix = TwoPlayerMatrix | ThreePlayerMatrix;

export {
  Game,
  TwoPlayerGame,
  ThreePlayerGame,
  Matrix,
  TwoPlayerMatrix,
  ThreePlayerMatrix,
  Player,
  Round,
  Strategy,
  MixedStrategy,
};
