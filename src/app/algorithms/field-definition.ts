export type Properties<T extends any, V> = {
  readonly [P in keyof T]: V;
}

export interface ConfigValue {
  defaultValue: number;
  type: ValueType;
}

export enum ValueType {
  decimal = "decimal",
  integer = "integer"
}

export interface FieldDefinition<T> extends ConfigValue {
  field: keyof T;
}

export function extractValues<T, V>(props: Properties<T, ConfigValue>, mapper: (k: keyof T, v: ConfigValue) => V): Properties<T, V> {
  const result = {};
  Object.entries(props).forEach(([k, v]: [string, ConfigValue]) => result[k] = mapper(k as keyof T, v));
  return result as Properties<T, V>;
}

export function toFieldDefinition<T>(props: Properties<T, ConfigValue>): FieldDefinition<T>[] {
  return Object.entries(props).map(([field, {defaultValue, type}]: [string, ConfigValue]) => ({
    type, defaultValue, field
  })) as FieldDefinition<T>[]
}

