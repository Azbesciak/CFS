import {NgModule} from "@angular/core";
import {ClassifiersListComponent} from "./classifiers-list.component";
import {CommonModule} from "@angular/common";
import {TableModule} from "../../ui-utils/table/table.module";

@NgModule({
  declarations: [ClassifiersListComponent],
  exports: [ClassifiersListComponent],
  imports: [
    CommonModule,
    TableModule,
  ]
})
export class ClassifiersListModule {
}
