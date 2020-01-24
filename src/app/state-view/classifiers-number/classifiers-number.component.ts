import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import {AlgorithmService} from "../../algorithm-worker/algorithm.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Unsubscribable} from "rxjs";

@Component({
  selector: 'app-classifiers-number',
  templateUrl: './classifiers-number.component.html',
  styleUrls: ['./classifiers-number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ClassifiersNumberComponent implements OnInit, OnDestroy {
  private subs: Unsubscribable[] = [];
  currentValue = 20;
  control = new FormControl(this.currentValue, [
    Validators.min(0), Validators.pattern(/\d+/), Validators.required
  ]);
  group = new FormGroup({"value": this.control});

  constructor(private algorithm: AlgorithmService, private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.algorithm.updateClassifiersNumber(this.currentValue);
    this.subs.push(this.subscribeClassifiersCountChange());
    this.subs.push(this.watchValueChange());
  }

  private subscribeClassifiersCountChange() {
    return this.algorithm.classifiers$.subscribe(c => {
      this.currentValue = c.length;
      this.changeDetector.markForCheck();
    });
  }

  watchValueChange() {
    return this.group.valueChanges.subscribe(({value}) => this.updateValue(value))
  }

  updateValue(value = this.control.value) {
    if (value < 0) return;
    value = Math.floor(value);
    this.algorithm.updateClassifiersNumber(value);
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
    this.subs.length = 0;
  }
}
