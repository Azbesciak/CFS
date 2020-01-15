import {ChangeDetectionStrategy, Component, Input, NgModule, OnInit, ViewEncapsulation} from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-section-header',
  template: '<div class="section-header">{{label}}</div>',
  styles: [`
    app-section-header .section-header {
      font-weight: 500;
      font-size: 1.25rem;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class SectionHeaderComponent implements OnInit {

  @Input()
  label: string;


  ngOnInit() {
  }

}

@NgModule({
  declarations: [SectionHeaderComponent],
  exports: [SectionHeaderComponent],
  imports: [CommonModule]
})
export class SectionHeaderModule {
}
