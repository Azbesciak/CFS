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
import {matrix} from "../algorithms/matrix";

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
  height = environment.chess.height;
  width = environment.chess.width;
  chessboard: Chessboard = matrix(this.width, this.height, () => ({
    originalValue: Alphabet.Zero,
    predictedValue: Alphabet.Zero
  }));
  private currentPattern: Pattern;
  // repeat(1fr, len) does not work in angular 8 - sanitizer .
  // https://github.com/angular/angular/issues/28897
  @HostBinding("style.grid-template-columns")
  columns = "1fr ".repeat(this.width);

  constructor(private patternService: PatternService, private changeDet: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.patternSub = this.patternService.selectedPattern.subscribe(p => {
      this.currentPattern = p;
      p.value.forEach((patternRow, x) => {
        const chessRow = this.chessboard[x];
        patternRow.forEach((originalValue, y) => {
          // to mark object as changed - simple property assignment does not work
          chessRow[y] = {...chessRow[y], originalValue}
        })
      });
      this.changeDet.markForCheck();
    })
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
  }


}
