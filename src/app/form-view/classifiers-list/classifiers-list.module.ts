import {NgModule} from "@angular/core";
import {ClassifiersListComponent} from "./classifiers-list.component";
import {CommonModule} from "@angular/common";
import {GenericFormModule} from "../../ui-utils/generic-form/generic-form.module";
import {SectionHeaderModule} from "../../ui-utils/section-header/section-header.component";
import {MatTableModule} from "@angular/material/table";
import {TranslateModule} from "@ngx-translate/core";
import {MatSortModule} from "@angular/material/sort";
import {NoContentModule} from "../../ui-utils/no-content/no-content.component";

@NgModule({
  declarations: [ClassifiersListComponent],
  exports: [ClassifiersListComponent],
  imports: [
    CommonModule,
    GenericFormModule,
    SectionHeaderModule,
    MatTableModule,
    TranslateModule,
    MatSortModule,
    NoContentModule
  ]
})
export class ClassifiersListModule {
}
