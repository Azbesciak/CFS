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
import {PatternService} from "../form-view/settings-view/state-tab/pattern.service";
import {environment} from "../../environments/environment";
import {Alphabet} from "../algorithms/alphabet";
import {Unsubscribable} from "rxjs";
import {Pattern} from "../form-view/settings-view/state-tab/pattern";
import {Matrix, matrix} from "../algorithms/matrix";
import {AlgorithmService} from "../algorithm-worker/algorithm.service";

export type Chessboard = ChessCell[][];

@Component({
  selector: 'app-chess-view',
  templateUrl: './chess-view.component.html',
  styleUrls: ['./chess-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChessViewComponent implements OnInit, OnDestroy {
  private patternSub: Unsubscribable;
  private resultSub: Unsubscribable;
  height = environment.chess.height;
  width = environment.chess.width;
  chessboard: Chessboard = matrix(this.width, this.height, () => ({
    originalValue: Alphabet.Zero,
    predictedValue: Alphabet.PassThrough
  }));
  private currentPattern: Pattern;
  // repeat(1fr, len) does not work in angular 8 - sanitizer .
  // https://github.com/angular/angular/issues/28897
  @HostBinding("style.grid-template-columns")
  columns = "1fr ".repeat(this.width);

  constructor(
    private patternService: PatternService,
    private changeDet: ChangeDetectorRef,
    private algorithm: AlgorithmService
  ) {
  }

  ngOnInit() {
    this.subscribeToPatternChange();
    this.subscribeToPrediction();
  }

  private subscribeToPatternChange() {
    this.patternSub = this.patternService.selectedPattern.subscribe(p => {
      this.currentPattern = p;
      this.applyForEachMatrixCell(
        p.value,
        (current, originalValue) => ({...current, originalValue})
      );
    });
  }

  private subscribeToPrediction() {
    this.resultSub = this.algorithm.resultUpdates$.subscribe(r =>
      this.applyForEachMatrixCell(
        r.prediction,
        (current, predictedValue) => ({...current, predictedValue})
      )
    );
  }

  private applyForEachMatrixCell(
    newValues: Matrix<Alphabet>,
    mapper: (currentValue: ChessCell, newValue: Alphabet) => ChessCell
  ) {
    newValues.forEach((row, x) => {
      const chessRow = this.chessboard[x];
      row.forEach((value, y) => chessRow[y] = mapper(chessRow[y], value))
    });
    this.changeDet.markForCheck();
  }

  onCellClicked(cell: ChessCell, x: number, y: number, $event: MouseEvent) {
    const pattern = this.currentPattern.value.map(row => row.slice());
    pattern[x][y] = cell.originalValue === Alphabet.Zero ? Alphabet.One : Alphabet.Zero;
    this.patternService.selectCustomPattern(pattern);
  }

  ngOnDestroy(): void {
    if (this.patternSub) {
      this.patternSub.unsubscribe();
      this.patternSub = null;
    }
    if (this.resultSub) {
      this.resultSub.unsubscribe();
      this.resultSub = null;
    }
  }

}
