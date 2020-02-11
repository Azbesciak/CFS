import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsComponent} from './settings.component';
import {ComputationSpeedModule} from "./computation-speed/computation-speed.module";


@NgModule({
  declarations: [SettingsComponent],
  exports: [
    SettingsComponent
  ],
  imports: [
    CommonModule,
    ComputationSpeedModule
  ]
})
export class SettingsModule {
}
