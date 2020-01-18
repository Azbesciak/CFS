import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SliderComponent} from './slider.component';
import {MatSliderModule} from "@angular/material/slider";
import {TranslateModule} from "@ngx-translate/core";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [SliderComponent],
  exports: [
    SliderComponent
  ],
  imports: [
    CommonModule,
    MatSliderModule,
    TranslateModule,
    ReactiveFormsModule
  ]
})
export class SliderModule {
}
