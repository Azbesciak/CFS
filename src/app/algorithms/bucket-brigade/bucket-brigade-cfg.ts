import {ConfigValue, Properties, ValueType} from "../field-definition";

export interface BucketBrigadeCfg {
    readonly k: number;
    readonly lifeTax: number;
    readonly bidTax: number;
    readonly winners: number;
    readonly msgAgeThreshold: number;
}

export const bucketBrigadeProperties: Properties<BucketBrigadeCfg, ConfigValue> = {
  k: {type: ValueType.decimal, current: 0.1, min: 0.01, max: 1, step: 0.01},
  lifeTax: {type: ValueType.decimal, current: 0.06, min: 0.01, max: 1, step: 0.01},
  bidTax: {type: ValueType.decimal, current: 0.05, min: 0.01, max: 1, step: 0.01},
  winners: {type: ValueType.integer, current: 1, min: 1, max: 100, step: 1},
  msgAgeThreshold: {type: ValueType.integer, current: 3, min: 0, max: 100, step: 1}
};
