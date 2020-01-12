import {ChangeDetectionStrategy, Component, Input, ViewChild, ViewEncapsulation} from '@angular/core';
import {Classifier, ClassifierView} from "../../algorithms/classifier";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-classifiers-list',
  templateUrl: './classifiers-list.component.html',
  styleUrls: ['./classifiers-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClassifiersListComponent {
  dataSource = new MatTableDataSource<ClassifierView>([]);
  displayedColumns: (keyof ClassifierView)[] = ["id", "action", "condition", "strength", "specifity"];

  @ViewChild(MatSort, {static: false})
  sort: MatSort;

  @Input()
  set classifiers(classifiers: Classifier[]) {
    this.dataSource.data = (classifiers || []).map(v => v.view);
    setTimeout(() => this.dataSource.sort = this.sort)
  }

}
