import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StateViewComponent} from "./state-view.component";
import {ClassifiersNumberComponent} from "./classifiers-number/classifiers-number.component";
import {TranslateModule} from "@ngx-translate/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatSelectModule} from "@angular/material/select";
import {StateControlsComponent} from './state-controls/state-controls.component';
import {ComputationSpeedModule} from "./computation-speed/computation-speed.module";


@NgModule({
  declarations: [StateViewComponent, ClassifiersNumberComponent, StateControlsComponent],
  exports: [StateViewComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatIconModule,
    MatTooltipModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    ComputationSpeedModule
  ]
})
export class StateViewModule {
}
