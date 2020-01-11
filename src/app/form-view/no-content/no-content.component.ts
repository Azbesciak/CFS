import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-no-content',
  template: '{{message}}',
  styles: [`
    app-no-content {
      padding: 1rem 0.5rem;
      text-align: center;
      font-weight: 400;
      opacity: 0.8;
      display: block;
    }
  `],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoContentComponent implements OnInit {

  @Input()
  message: string;

  constructor() { }

  ngOnInit() {
  }

}
