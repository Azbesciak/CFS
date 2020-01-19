import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {Classifier, ClassifierView} from "../../algorithms/classifier";

@Component({
  selector: 'app-classifiers-list',
  templateUrl: './classifiers-list.component.html',
  styleUrls: ['./classifiers-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClassifiersListComponent {
  displayedColumns: (keyof ClassifierView)[] = ["id", "condition", "action", "strength", "specifity", "lived"];

  @Input()
  set classifiers(classifiers: Classifier[]) {
    this.classifiersViews = (classifiers || []).map(v => v.view);
  }

  classifiersViews: ClassifierView[] = [];

}
