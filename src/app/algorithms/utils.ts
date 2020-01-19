

export function randomArrayValue<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export function randomArrayOfValues<T>(values: T[], length: number) {
  return Array.from({length}, () => randomArrayValue(values));
}

export function randomArrayMutate<T>(array: T[], values: T[], mutationProbability: number) {
  for (let i = 0; i < array.length; i++) {
    if (Math.random() < mutationProbability) {
      array[i] = randomArrayValue(values);
    }
  }
}

export function breed<T>(a1: T[], a2: T[]) {
  const result = a1.slice();
  for (let i = 0; i < a1.length; i++) {
    if (Math.random() < 0.5)
      result[i] = a2[i];
  }
  return result;
}

export function isArray(arr: any): arr is Array<any> {
  return arr instanceof Array;
}

export function primitiveArrayEquals<T>(a1: T[], a2: T[]) {
  if (a1 === a2 || !a1 && !a2) return true;
  if (!a1 || !a2) return false;
  if (!isArray(a1) || !isArray(a2)) return false;
  if (a1.length !== a2.length) return false;
  for (let i = 0; i < a1.length; i++) {
    if (a1[i] !== a2[i]) return false;
  }
  return true;
}

export function isNum(value: any): value is number {
  return typeof value === "number";
}
