import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Pattern, PatternService} from "./pattern.service";
import {MatSelectChange} from "@angular/material/select";
import {AlgorithmService} from "../algorithm.service";
import {Unsubscribable} from "rxjs";

@Component({
  selector: 'app-state-tab',
  templateUrl: './state-tab.component.html',
  styleUrls: ['./state-tab.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateTabComponent implements OnInit, OnDestroy {
  isStarted: boolean;
  accuracy = 0;
  patterns: Pattern[];
  private startSub: Unsubscribable;

  constructor(
    readonly patternService: PatternService,
    readonly algorithm: AlgorithmService
  ) {
  }

  ngOnInit() {
    this.patterns = this.patternService.getAvailablePatterns();
    this.startSub = this.algorithm.isStarted.subscribe(v => this.isStarted = v);
  }

  onPatternChanged($event: MatSelectChange) {
    this.patternService.selectPattern($event.value);
  }

  ngOnDestroy(): void {
    if (this.startSub) {
      this.startSub.unsubscribe();
      this.startSub = null;
    }
  }
}
