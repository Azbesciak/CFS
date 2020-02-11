import {ChangeDetectionStrategy, Component, Input, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent<T> {
  @Input()
  set customAction(value: CustomAction<T>) {
    this.action = value;
    this.updateAction();
  }

  @Input()
  set columns(value: (keyof T)[]) {
    this.headerColumns = value;
    this.updateAction();
  }

  dataSource = new MatTableDataSource<T>([]);
  headerColumns: (keyof T)[];
  rowColumns: (keyof T | string)[];

  @Input()
  set data(value: T[]) {
    this.dataSource.data = (value || []);
    setTimeout(() => this.dataSource.sort = this.sort)
  }

  action: CustomAction<T>;

  @Input()
  label: string;

  @Input()
  noValueMessage: string;

  @ViewChild(MatSort, {static: false})
  sort: MatSort;

  updateAction() {
    if (this.action && this.headerColumns)
      this.rowColumns = [...this.headerColumns, this.action.label];
    else
      this.rowColumns = this.headerColumns;
  }

}

export interface CustomAction<T> {
  label: string;
  action: (row: T) => void;
  icon: string;
}
