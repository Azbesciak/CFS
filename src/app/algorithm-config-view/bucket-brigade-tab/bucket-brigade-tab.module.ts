import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {GenericFormModule} from "../../ui-utils/generic-form/generic-form.module";
import {BucketBrigadeTabComponent} from "./bucket-brigade-tab.component";

@NgModule({
  declarations: [BucketBrigadeTabComponent],
  exports: [BucketBrigadeTabComponent],
  imports: [
    CommonModule,
    GenericFormModule
  ]
})
export class BucketBrigadeTabModule {
}
