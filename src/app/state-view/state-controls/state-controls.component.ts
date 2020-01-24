import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'app-state-controls',
  templateUrl: './state-controls.component.html',
  styleUrls: ['./state-controls.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateControlsComponent implements OnInit {
  @Input()
  isStarted: boolean;

  @Output()
  isStartedChanged = new EventEmitter<boolean>();

  @Output()
  reset = new EventEmitter();

  ngOnInit() {
  }

  toggleState() {
    this.isStartedChanged.next(!this.isStarted);
  }

  onReset() {
    this.reset.next()
  }

}
