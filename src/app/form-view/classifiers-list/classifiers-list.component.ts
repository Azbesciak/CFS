import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {Classifier, ClassifierView} from "../../algorithms/classifier";
import {CustomAction} from "../../ui-utils/table/table.component";

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

  @Output()
  classifierRemoved = new EventEmitter<number>();

  classifiersViews: ClassifierView[] = [];

  removeAction: CustomAction<ClassifierView> = {
    action: row => this.classifierRemoved.next(row.id),
    label: "delete",
    icon: "close"
  }
}
