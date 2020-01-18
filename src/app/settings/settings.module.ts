import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import {ComputationDelayModule} from "./computation-delay/computation-delay.module";



@NgModule({
  declarations: [SettingsComponent],
  exports: [
    SettingsComponent
  ],
  imports: [
    CommonModule,
    ComputationDelayModule
  ]
})
export class SettingsModule { }
