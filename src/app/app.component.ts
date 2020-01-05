import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {Chessboard} from './chess-view/chess-view.component';
import {environment} from '../environments/environment';
import {randomArrayValue} from './algorithms/utils';
import {ALPHABET} from './algorithms/alphabet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  values: Chessboard = Array.from({length: environment.chess.width},
    () => Array.from({length: environment.chess.height},
      () => ({originalValue: randomArrayValue(ALPHABET), predictedValue: randomArrayValue(ALPHABET)}
      )));

}
