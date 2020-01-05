import {ChangeDetectionStrategy, Component, HostBinding, HostListener, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ChessCell} from './chess-cell/chess-cell';

export type Chessboard = ChessCell[][];

@Component({
  selector: 'app-chess-view',
  templateUrl: './chess-view.component.html',
  styleUrls: ['./chess-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChessViewComponent implements OnInit {

  get chessboard(): ChessCell[][] {
    return this._chessboard;
  }

  @Input()
  set chessboard(value: ChessCell[][]) {
    this._chessboard = value;
    // repeat(1fr, len) does not work in angular 8 - sanitizer .
    // https://github.com/angular/angular/issues/28897
    this.columns = "1fr ".repeat(value.length);
  }

  private _chessboard: Chessboard;

  @HostBinding("style.grid-template-columns")
  columns: string;

  constructor() {
  }

  ngOnInit() {
  }

  onCellClicked(cell: ChessCell, x: number, y: number, $event: MouseEvent) {

  }
}
