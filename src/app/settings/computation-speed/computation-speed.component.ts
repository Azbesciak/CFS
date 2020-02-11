import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {environment} from "../../../environments/environment";
import {AlgorithmService} from "../../algorithm-worker/algorithm.service";
import {FormControl} from "@angular/forms";
import {Unsubscribable} from "rxjs";

@Component({
  selector: 'app-computation-speed',
  templateUrl: './computation-speed.component.html',
  styleUrls: ['./computation-speed.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ComputationSpeedComponent implements OnInit, OnDestroy {
  settings = Object.assign({}, environment.computation.delay);
  control = new FormControl(this.reverseValue(this.settings.current));
  private sub: Unsubscribable;

  constructor(private algorithmService: AlgorithmService) {
  }

  ngOnInit() {
    this.algorithmService.updateComputationDelay(this.settings.current);
    this.sub = this.control.valueChanges
      .subscribe(v => this.algorithmService.updateComputationDelay(this.reverseValue(v)));
  }

  private reverseValue(value: number) {
    return this.settings.max - value;
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = null;
    }
  }
}
