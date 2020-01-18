import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header.component';
import {TranslateModule} from "@ngx-translate/core";
import {LanguageModule} from "../language/language.module";
import {ThemePickerModule} from "../ui-utils/theme-picker/theme-picker.module";


@NgModule({
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
    imports: [
        CommonModule,
        TranslateModule,
        LanguageModule,
        ThemePickerModule
    ]
})
export class HeaderModule {
}
