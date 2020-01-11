import {ConfigValue, Properties, ValueType} from "../field-definition";

export interface GeneticAlgorithmCfg {
  readonly mutationProbability: number;
  readonly classifierMutationProbability: number;
  readonly strengthThreshold: number;
  readonly elitism: number;
  readonly outPercentage: number;
  readonly maxClassifiers: number;
}

export const geneticAlgorithmProperties: Properties<GeneticAlgorithmCfg, ConfigValue> = {
  outPercentage: {type: ValueType.decimal, defaultValue: 0.5},
  elitism: {type: ValueType.decimal, defaultValue: 0.3},
  maxClassifiers: {type: ValueType.integer, defaultValue: 100},
  strengthThreshold: {type: ValueType.decimal, defaultValue: 0.3},
  mutationProbability: {type: ValueType.decimal, defaultValue: 0.3},
  classifierMutationProbability: {type: ValueType.decimal, defaultValue: 0.4},
};

