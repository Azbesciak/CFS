import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatMenuModule} from "@angular/material/menu";
import {MatTooltipModule} from "@angular/material/tooltip";
import {StyleManager} from "./style-manager";
import {ThemePickerComponent} from "./theme-picker.component";
import {ThemeStorage} from "./theme-storage";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    TranslateModule,
  ],
  exports: [ThemePickerComponent],
  declarations: [ThemePickerComponent],
  providers: [StyleManager, ThemeStorage],
})
export class ThemePickerModule {
}
