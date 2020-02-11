import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {AlgorithmService} from "../algorithm-worker/algorithm.service";
import {Classifier} from "../algorithms/classifier";
import {throttleTime} from "rxjs/operators";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

@Component({
  selector: 'app-form-view',
  templateUrl: './form-view.component.html',
  styleUrls: ['./form-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormViewComponent {
  messages$ = throttle(this.algorithm.messages$);
  classifiers$ = throttle(this.algorithm.classifiers$);

  constructor(readonly algorithm: AlgorithmService) {
  }

  onClassifierAdded(newClassifier: Classifier) {
    this.algorithm.addClassifier(newClassifier);
  }

  onClassifierRemoved(classifierId: number) {
    this.algorithm.removeClassifier(classifierId);
  }
}

function throttle<T>(observable: Observable<T>) {
  return observable.pipe(throttleTime(environment.listThrottleTime));
}
