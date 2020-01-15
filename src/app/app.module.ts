import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ChessViewModule} from './chess-view/chess-view.module';
import {FormViewModule} from "./form-view/form-view.module";
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {LanguageModule} from "./language/language.module";
import {SettingsViewModule} from "./settings-view/settings-view.module";
import {StateViewModule} from "./state-view/state-view.module";
import {HeaderModule} from "./header/header.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ChessViewModule,
    FormViewModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    LanguageModule,
    SettingsViewModule,
    StateViewModule,
    HeaderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
