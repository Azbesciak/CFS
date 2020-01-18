import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from "@ngx-translate/core";
import {AlgorithmConfigViewComponent} from "./algorithm-config-view.component";
import {GeneticAlgorithmTabModule} from "./genetic-algorithm-tab/genetic-algorithm-tab.module";
import {BucketBrigadeTabModule} from "./bucket-brigade-tab/bucket-brigade-tab.module";
import {SectionHeaderModule} from "../ui-utils/section-header/section-header.component";


@NgModule({
  declarations: [AlgorithmConfigViewComponent],
  exports: [AlgorithmConfigViewComponent],
  imports: [
    GeneticAlgorithmTabModule,
    BucketBrigadeTabModule,
    CommonModule,
    TranslateModule,
    SectionHeaderModule
  ]
})
export class AlgorithmConfigViewModule {
}
