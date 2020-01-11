import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {Classifier, ClassifierView} from "../../algorithms/classifier";

@Component({
  selector: 'app-classifiers-list',
  templateUrl: './classifiers-list.component.html',
  styleUrls: ['./classifiers-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClassifiersListComponent implements OnInit {
  @Input()
  set classifiers(value: Classifier[]) {
    this.classifiersViews = value ? value.map(c => c.view) : [];
  }

  displayedColumns: (keyof ClassifierView)[]= ["index", "action", "condition", "strength", "specifity"];

  classifiersViews: ClassifierView[];

  constructor() { }

  ngOnInit() {
  }

}
