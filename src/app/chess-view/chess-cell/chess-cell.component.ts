import {ChangeDetectionStrategy, Component, HostBinding, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ChessCell} from './chess-cell';
import {Alphabet} from '../../algorithms/alphabet';

@Component({
  selector: 'app-chess-cell',
  templateUrl: './chess-cell.component.html',
  styleUrls: ['./chess-cell.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ChessCellComponent implements OnInit {
  @Input()
  set value(value: ChessCell) {
    this._value = value;
    this.predictedClass = value && this.getClass(value.predictedValue);
    this.actualClass = value && this.getClass(value.originalValue);
  }

  private _value: ChessCell;
  predictedClass: any;

  @HostBinding("class")
  actualClass;


  private getClass(value: Alphabet) {
    if (!value) {
      return;
    }
    switch (value) {
      case Alphabet.One:
        return 'one';
      case Alphabet.Zero:
        return 'zero';
      default:
        return 'unknown';
    }
  }

  constructor() {
  }

  ngOnInit() {
  }

}
