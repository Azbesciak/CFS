import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GenericFormComponent} from "./generic-form.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSliderModule} from "@angular/material/slider";
import {TranslateModule} from "@ngx-translate/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {SliderModule} from "../slider/slider.module";


@NgModule({
  declarations: [GenericFormComponent],
  exports: [GenericFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSliderModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
    SliderModule
  ]
})
export class GenericFormModule {
}
