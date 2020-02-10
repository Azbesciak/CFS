import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ComputationSpeedComponent} from './computation-speed.component';
import {MatSliderModule} from "@angular/material/slider";
import {TranslateModule} from "@ngx-translate/core";
import {SliderModule} from "../../ui-utils/slider/slider.module";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [ComputationSpeedComponent],
  exports: [
    ComputationSpeedComponent
  ],
  imports: [
    CommonModule,
    MatSliderModule,
    TranslateModule,
    SliderModule,
    ReactiveFormsModule
  ]
})
export class ComputationDelayModule {
}
