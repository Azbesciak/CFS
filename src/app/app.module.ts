import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ChessViewModule} from './chess-view/chess-view.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ChessViewModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
