import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessViewComponent } from './chess-view.component';
import { ChessCellComponent } from './chess-cell/chess-cell.component';
import {MatTooltipModule} from "@angular/material/tooltip";
import {TranslateModule} from "@ngx-translate/core";



@NgModule({
  declarations: [ChessViewComponent, ChessCellComponent],
  exports: [ChessViewComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    TranslateModule
  ]
})
export class ChessViewModule { }
