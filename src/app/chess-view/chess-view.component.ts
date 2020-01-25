import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  HostBinding,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {ChessCell} from './chess-cell/chess-cell';
import {PatternService} from "../state-view/pattern.service";
import {environment} from "../../environments/environment";
import {Alphabet} from "../algorithms/alphabet";
import {Unsubscribable} from "rxjs";
import {Pattern} from "../state-view/pattern";
import {Matrix, matrix} from "../algorithms/matrix";
import {AlgorithmService} from "../algorithm-worker/algorithm.service";
import {round} from "../algorithms/utils";

export type Chessboard = ChessCell[][];

@Component({
  selector: 'app-chess-view',
  templateUrl: './chess-view.component.html',
  styleUrls: ['./chess-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChessViewComponent implements OnInit, OnDestroy {
  private subs: Unsubscribable[] = [];
  height = environment.chess.height;
  width = environment.chess.width;
  chessboard: Chessboard = matrix(this.width, this.height, (x, y) => ({
    id: x * this.width + y,
    originalValue: Alphabet.Zero,
    predictedValue: Alphabet.PassThrough,
    accuracy: 0
  }));
  private currentPattern: Pattern;
  // repeat(1fr, len) does not work in angular 8 - sanitizer .
  // https://github.com/angular/angular/issues/28897
  @HostBinding("style.grid-template-columns")
  columns = "1fr ".repeat(this.width);

  cellIdentity = (_, cell) => cell.id;

  constructor(
    private patternService: PatternService,
    private changeDet: ChangeDetectorRef,
    private algorithm: AlgorithmService
  ) {
  }

  ngOnInit() {
    this.subscribeToPatternChange();
    this.subscribeToPrediction();
    this.subscribeSingleValueUpdate();
  }

  private subscribeToPatternChange() {
    this.subs.push(this.patternService.selectedPattern.subscribe(p => {
      this.currentPattern = p;
      this.applyForEachMatrixCell(
        p.value,
        (current, originalValue) => ({...current, originalValue})
      );
    }));
  }

  private subscribeToPrediction() {
    this.subs.push(this.algorithm.resultUpdates$.subscribe(r =>
      this.applyForEachMatrixCell(
        r.prediction,
        (current, prediction) => ({
          id: current.id,
          originalValue: current.originalValue,
          predictedValue: prediction.result,
          accuracy: round(prediction.accuracy)
        })
      )
    ));
  }

  private subscribeSingleValueUpdate() {
    this.subs.push(this.algorithm.singleResultUpdates$.subscribe(r => {
      const {id, originalValue} = this.chessboard[r.x][r.y];
      this.chessboard[r.x][r.y] = {
        id, originalValue, accuracy: r.accuracy, predictedValue: r.prediction.result
      };
      this.changeDet.markForCheck();
    }))
  }

  private applyForEachMatrixCell<T>(
    newValues: Matrix<T>,
    mapper: (currentValue: ChessCell, newValue: T) => ChessCell
  ) {
    newValues.forEach((row, x) => {
      const chessRow = this.chessboard[x];
      row.forEach((value, y) => chessRow[y] = mapper(chessRow[y], value))
    });
    this.changeDet.markForCheck();
  }

  onCellClicked(cell: ChessCell, x: number, y: number) {
    const pattern = this.currentPattern.value.map(row => row.slice());
    pattern[x][y] = cell.originalValue === Alphabet.Zero ? Alphabet.One : Alphabet.Zero;
    this.patternService.selectCustomPattern(pattern);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.subs = [];
  }

}
