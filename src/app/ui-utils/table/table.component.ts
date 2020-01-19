import {ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent<T> implements OnInit {
  dataSource = new MatTableDataSource<T>([]);

  @Input()
  set data(value: T[]) {
    this.dataSource.data = (value || []);
    setTimeout(() => this.dataSource.sort = this.sort)
  }

  @Input()
  label: string;

  @Input()
  noValueMessage: string;

  @Input()
  columns: (keyof T)[];


  @ViewChild(MatSort, {static: false})
  sort: MatSort;

  ngOnInit() {
  }

}
