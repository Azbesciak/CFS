import {NgModule} from "@angular/core";
import {GeneticAlgorithmTabComponent} from "./genetic-algorithm-tab.component";
import {CommonModule} from "@angular/common";
import {GenericFormModule} from "../../ui-utils/generic-form/generic-form.module";

@NgModule({
  declarations: [GeneticAlgorithmTabComponent],
  exports: [GeneticAlgorithmTabComponent],
  imports: [
    CommonModule,
    GenericFormModule
  ]
})
export class GeneticAlgorithmTabModule {

}
