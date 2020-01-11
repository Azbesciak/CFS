import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {ClassifierView} from "../../algorithms/classifier";
import {AlgorithmService} from "../settings-view/algorithm.service";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";

@Component({
  selector: 'app-classifiers-list',
  templateUrl: './classifiers-list.component.html',
  styleUrls: ['./classifiers-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClassifiersListComponent implements OnInit {
  @ViewChild(MatSort, {static: false})
  sort: MatSort;

  dataSource = new MatTableDataSource<ClassifierView>([]);
  displayedColumns: (keyof ClassifierView)[] = ["index", "action", "condition", "strength", "specifity"];

  constructor(readonly algorithm: AlgorithmService, private changeDet: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.algorithm.classifiers$.subscribe(c => {
      this.dataSource.data = c.map(v => v.view);
      this.changeDet.markForCheck();
      setTimeout(() => this.dataSource.sort = this.sort)
    });
  }

}
