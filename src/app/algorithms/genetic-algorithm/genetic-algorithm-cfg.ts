import {ConfigValue, Properties, ValueType} from "../field-definition";

export interface GeneticAlgorithmCfg {
  readonly breedsLimit: number;
  readonly mutationProbability: number;
  readonly classifierMutationProbability: number;
  readonly strengthThreshold: number;
  readonly elitism: number;
  readonly outPercentage: number;
  readonly maxClassifiers: number;
}

export const geneticAlgorithmProperties: Properties<GeneticAlgorithmCfg, ConfigValue> = {
  breedsLimit: {type: ValueType.integer, current: 1, step: 1, max: 100, min: 0},
  outPercentage: {type: ValueType.decimal, current: 0.5, step: 0.01, max: 1, min: 0.01},
  elitism: {type: ValueType.decimal, current: 0.3, step: 0.01, max: 1, min: 0.01},
  maxClassifiers: {type: ValueType.integer, current: 100, step: 1, max: 1, min: 1},
  strengthThreshold: {type: ValueType.decimal, current: 0.3, step: 0.1, max: 5, min: 0},
  mutationProbability: {type: ValueType.decimal, current: 0.3, step: 0.01, max: 1, min: 0.01},
  classifierMutationProbability: {type: ValueType.decimal, current: 0.4, step: 0.01, max: 1, min: 0.01},
};

