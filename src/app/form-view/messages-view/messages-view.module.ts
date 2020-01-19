import {NgModule} from "@angular/core";
import {MessagesViewComponent} from "./messages-view.component";
import {CommonModule} from "@angular/common";
import {TableModule} from "../../ui-utils/table/table.module";

@NgModule({
  declarations: [MessagesViewComponent],
  exports: [MessagesViewComponent],
  imports: [CommonModule, TableModule]
})
export class MessagesViewModule {
}
