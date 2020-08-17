import TwoPlayerTemplates from './TwoPlayerTemplates.json';

type TwoPlayerPaymentMatrix = {
  [firstStrategy: string]: {
    [secondStrategy: string]: [number, number];
  };
};

interface TwoPlayerTemplatesInterface {
  BattleOfTheSexes: TwoPlayerPaymentMatrix;
  Chicken: TwoPlayerPaymentMatrix;
  MatchingPennies: TwoPlayerPaymentMatrix;
  PrisonersDilemma: TwoPlayerPaymentMatrix;
  RockPaperScissors: TwoPlayerPaymentMatrix;
  RockPaperScissorsLizardSpock: TwoPlayerPaymentMatrix;
  StagHunt: TwoPlayerPaymentMatrix;
  TravelersDilemma: TwoPlayerPaymentMatrix;
}

const Templates = {
  TwoPlayerTemplates,
  ThreePlayerTemplates: {}
};

export default Templates;
