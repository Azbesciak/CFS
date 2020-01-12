export function matrix<T>(width: number, height: number, supplier: (x: number, y: number) => T): Matrix<T> {
  return Array.from({length: width},
    (_, x) => Array.from({length: height},
      (_, y) => supplier(x, y)))
}

export type Matrix<T> = T[][];
