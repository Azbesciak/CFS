import {Injectable} from "@angular/core";
import {Alphabet} from "../../../algorithms/alphabet";
import {environment} from "../../../../environments/environment";

export interface Pattern {
  name: string;
  value: Alphabet[][];
}

export function matrix<T>(width: number, height: number, supplier: (x: number, y: number) => T) {
  return Array.from({length: width},
    (_, x) => Array.from({length: height},
      (_, y) => supplier(x, y)))
}

function horizontalLinesPattern(width: number, height: number): Pattern {
  return {
    name: "horizontal_lines",
    value: matrix(width, height, x => x % 2 === 0 ? Alphabet.Zero : Alphabet.One)
  }
}

function halfByHalfPattern(width: number, height: number): Pattern {
  return {
    name: "half_by_half",
    value: matrix(width, height, x => x < height / 2 ? Alphabet.Zero : Alphabet.One)
  }
}

function verticalLinesPattern(width: number, height: number): Pattern {
  return {
    name: "half_by_half",
    value: matrix(width, height, (_, y) => y % 2 === 0 ? Alphabet.Zero : Alphabet.One)
  }
}

function whitePattern(width: number, height: number): Pattern {
  return {
    name: "white",
    value: matrix(width, height, () => Alphabet.Zero)
  }
}

function chessPattern(widget, height: number): Pattern {
  return {
    name: "chess",
    value: matrix(widget, height, (x, y) => (x + y) % 2 === 0 ? Alphabet.One : Alphabet.Zero)
  }
}

function generatePatterns(width: number, height: number): Pattern[] {
  return [
    halfByHalfPattern(width, height),
    horizontalLinesPattern(width, height),
    verticalLinesPattern(width, height),
    whitePattern(width, height),
    chessPattern(width, height)
  ]
}

@Injectable({
  providedIn: "root"
})
export class PatternService {
  availablePatterns() {
    const {height, width} = environment.chess;
    return generatePatterns(width, height);
  }
}
