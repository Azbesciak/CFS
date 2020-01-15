import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {SettingsViewComponent} from "./settings-view.component";
import {GeneticAlgorithmTabModule} from "./genetic-algorithm-tab/genetic-algorithm-tab.module";
import {BucketBrigadeTabModule} from "./bucket-brigade-tab/bucket-brigade-tab.module";
import {SectionHeaderModule} from "../ui-utils/section-header/section-header.component";


@NgModule({
  declarations: [SettingsViewComponent],
  exports: [SettingsViewComponent],
  imports: [
    GeneticAlgorithmTabModule,
    BucketBrigadeTabModule,
    CommonModule,
    TranslateModule,
    SectionHeaderModule
  ]
})
export class SettingsViewModule {
}
