import {ConfigValue, Properties, ValueType} from "../field-definition";

export interface BucketBrigadeCfg {
    readonly k: number;
    readonly lifeTax: number;
    readonly bidTax: number;
    readonly winners: number;
}

export const bucketBrigadeProperties: Properties<BucketBrigadeCfg, ConfigValue> = {
  k: {type: ValueType.decimal, current: 0.1, min: 0.01, max: 1, step: 0},
  lifeTax: {type: ValueType.decimal, current: 0.06, min: 0.01, max: 1, step: 0},
  bidTax: {type: ValueType.decimal, current: 0.05, min: 0.01, max: 1, step: 0},
  winners: {type: ValueType.integer, current: 1, min: 1, step: 0}
};
