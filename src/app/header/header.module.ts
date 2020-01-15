import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './header.component';
import {TranslateModule} from "@ngx-translate/core";
import {LanguageModule} from "../language/language.module";


@NgModule({
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
  imports: [
    CommonModule,
    TranslateModule,
    LanguageModule
  ]
})
export class HeaderModule {
}
