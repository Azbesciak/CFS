import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-section-header',
  template: '<h4 class="section-header">{{label}}</h4>',
  styles: [`
    app-section-header .section-header {
      font-weight: 500;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SectionHeaderComponent implements OnInit {

  @Input()
  label: string;

  constructor() { }

  ngOnInit() {
  }

}
