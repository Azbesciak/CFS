export interface ClassifierConfig {
    mutationProbability: number;
}
export function defaultClassifierConfig(): ClassifierConfig {
  return {mutationProbability: 0.4}
}
