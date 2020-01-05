import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessViewComponent } from './chess-view.component';
import { ChessCellComponent } from './chess-cell/chess-cell.component';



@NgModule({
  declarations: [ChessViewComponent, ChessCellComponent],
  exports: [ChessViewComponent],
  imports: [
    CommonModule
  ]
})
export class ChessViewModule { }
