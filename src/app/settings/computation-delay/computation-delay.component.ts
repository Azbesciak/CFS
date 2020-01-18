import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {environment} from "../../../environments/environment";
import {AlgorithmService} from "../../algorithm-worker/algorithm.service";
import {FormControl} from "@angular/forms";
import {Unsubscribable} from "rxjs";

@Component({
  selector: 'app-computation-delay',
  templateUrl: './computation-delay.component.html',
  styleUrls: ['./computation-delay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class ComputationDelayComponent implements OnInit, OnDestroy {
  settings = Object.assign({}, environment.computation.delay);
  control = new FormControl(this.settings.current);
  private sub: Unsubscribable;
  format = (v: number) => `${(v / 1000).toFixed(2)}s`;

  constructor(private algorithmService: AlgorithmService) {
  }

  ngOnInit() {
    this.algorithmService.updateComputationDelay(this.settings.current);
    this.sub = this.control.valueChanges.subscribe(v => this.algorithmService.updateComputationDelay(v));
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
      this.sub = null;
    }
  }
}
