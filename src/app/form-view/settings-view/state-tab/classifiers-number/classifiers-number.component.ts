import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AlgorithmService} from "../../algorithm.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-classifiers-number',
  templateUrl: './classifiers-number.component.html',
  styleUrls: ['./classifiers-number.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ClassifiersNumberComponent implements OnInit {
  currentValue = 20;
  control = new FormControl(this.currentValue, [Validators.min(0), Validators.pattern(/\d+/), Validators.required]);
  group = new FormGroup({"value": this.control});
  constructor(private algorithm: AlgorithmService) {
  }

  ngOnInit() {
    this.algorithm.classifiers$.subscribe(c => this.control.setValue(c.length));
    this.algorithm.updateClassifiersNumber(this.currentValue);
  }

  acceptChange() {
    this.currentValue = this.control.value;
    this.algorithm.updateClassifiersNumber(this.currentValue);
  }
}
