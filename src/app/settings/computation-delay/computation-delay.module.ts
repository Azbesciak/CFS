import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComputationDelayComponent} from './computation-delay.component';
import {MatSliderModule} from "@angular/material/slider";
import {TranslateModule} from "@ngx-translate/core";
import {SliderModule} from "../../ui-utils/slider/slider.module";


@NgModule({
  declarations: [ComputationDelayComponent],
  exports: [
    ComputationDelayComponent
  ],
  imports: [
    CommonModule,
    MatSliderModule,
    TranslateModule,
    SliderModule
  ]
})
export class ComputationDelayModule {
}
