import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import {SectionHeaderModule} from "../section-header/section-header.component";
import {NoContentModule} from "../no-content/no-content.component";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {TranslateModule} from "@ngx-translate/core";



@NgModule({
  declarations: [TableComponent],
  exports: [
    TableComponent
  ],
  imports: [
    CommonModule,
    SectionHeaderModule,
    NoContentModule,
    MatTableModule,
    MatSortModule,
    TranslateModule
  ]
})
export class TableModule { }
