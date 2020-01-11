import {ConfigValue, Properties, ValueType} from "../field-definition";

export interface BucketBrigadeCfg {
    readonly k: number;
    readonly lifeTax: number;
    readonly bidTax: number;
    readonly winners: number;
    readonly msgAgeThreshold: number;
}

export const bucketBrigadeProperties: Properties<BucketBrigadeCfg, ConfigValue> = {
  k: {type: ValueType.decimal, defaultValue: 0.1},
  lifeTax: {type: ValueType.decimal, defaultValue: 0.06},
  bidTax: {type: ValueType.decimal, defaultValue: 0.05},
  winners: {type: ValueType.integer, defaultValue: 1},
  msgAgeThreshold: {type: ValueType.integer, defaultValue: 3}
};
