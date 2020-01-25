import {Injectable} from "@angular/core";
import {Alphabet} from "../algorithms/alphabet";
import {environment} from "../../environments/environment";
import {BehaviorSubject} from "rxjs";
import {Pattern} from "./pattern";
import {matrix} from "../algorithms/matrix";


function horizontalLinesPattern(width: number, height: number): Pattern {
  return {
    name: "horizontalLines",
    value: matrix(width, height, x => x % 2 === 0 ? Alphabet.Zero : Alphabet.One)
  }
}

function halfByHalfPattern(width: number, height: number): Pattern {
  return {
    name: "halfByHalf",
    value: matrix(width, height, x => x > height / 2 ? Alphabet.Zero : Alphabet.One)
  }
}

function verticalLinesPattern(width: number, height: number): Pattern {
  return {
    name: "verticalLines",
    value: matrix(width, height, (_, y) => y % 2 === 0 ? Alphabet.Zero : Alphabet.One)
  }
}

function whitePattern(width: number, height: number): Pattern {
  return {
    name: "ones",
    value: matrix(width, height, () => Alphabet.One)
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

const customPatternName = "custom";

@Injectable({
  providedIn: "root"
})
export class PatternService {
  private width: number = environment.chess.width;
  private height: number = environment.chess.height;
  readonly maxSize = this.height * this.width;
  private readonly patterns: Pattern[] = generatePatterns(this.width, this.height);

  private readonly _selectedPattern = new BehaviorSubject<Pattern>(this.patterns[0]);
  readonly selectedPattern = this._selectedPattern.asObservable();

  selectPattern(pattern: Pattern) {
    if (pattern.value.length !== this.width) return;
    if (pattern.value.some(v => v.length !== this.height)) return;
    this._selectedPattern.next(pattern);
  }

  getAvailablePatterns() {
    return this.patterns;
  }

  selectCustomPattern(pattern: Alphabet[][]) {
    if (this.patterns[0].name === customPatternName) {
      this.patterns[0].value = pattern;
    } else {
      this.patterns.unshift({
        name: customPatternName,
        value: pattern
      })
    }
    this.selectPattern(this.patterns[0]);
  }

}
