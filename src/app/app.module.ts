import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ChessViewModule} from './chess-view/chess-view.module';
import {FormViewModule} from "./form-view/form-view.module";
import {ServiceWorkerModule} from '@angular/service-worker';
import {environment} from '../environments/environment';
import {LanguageModule} from "./language/language.module";
import {AlgorithmConfigViewModule} from "./algorithm-config-view/algorithm-config-view.module";
import {StateViewModule} from "./state-view/state-view.module";
import {HeaderModule} from "./header/header.module";
import {SettingsModule} from "./settings/settings.module";
import {MatCardModule} from "@angular/material/card";

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
        AlgorithmConfigViewModule,
        HeaderModule,
        SettingsModule,
        StateViewModule,
        MatCardModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
