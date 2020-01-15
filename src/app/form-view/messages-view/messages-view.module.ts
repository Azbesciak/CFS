import {NgModule} from "@angular/core";
import {MessagesViewComponent} from "./messages-view.component";
import {CommonModule} from "@angular/common";
import {SectionHeaderModule} from "../../ui-utils/section-header/section-header.component";
import {MatListModule} from "@angular/material/list";
import {TranslateModule} from "@ngx-translate/core";
import {NoContentModule} from "../../ui-utils/no-content/no-content.component";

@NgModule({
  declarations: [MessagesViewComponent],
  exports: [MessagesViewComponent],
  imports: [CommonModule, SectionHeaderModule, MatListModule, MatListModule, TranslateModule, NoContentModule]
})
export class MessagesViewModule {
}
