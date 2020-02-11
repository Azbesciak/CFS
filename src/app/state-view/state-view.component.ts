import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {PatternService} from "./pattern.service";
import {MatSelectChange} from "@angular/material/select";
import {AlgorithmService} from "../algorithm-worker/algorithm.service";
import {merge, Observable, of, Unsubscribable} from "rxjs";
import {Pattern} from "./pattern";
import {map, tap} from "rxjs/operators";

@Component({
  selector: 'app-state-view',
  templateUrl: './state-view.component.html',
  styleUrls: ['./state-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateViewComponent implements OnInit, OnDestroy {
  isStarted: boolean;
  accuracy$: Observable<number>;
  patterns: Pattern[];
  private startSub: Unsubscribable;

  constructor(
    readonly patternService: PatternService,
    readonly algorithm: AlgorithmService
  ) {
  }

  ngOnInit() {
    this.patterns = this.patternService.getAvailablePatterns();
    this.startSub = this.algorithm.isStarted$.subscribe(v => this.isStarted = v);
    this.accuracy$ = this.prepareAccuracyUpdates();
  }

  private prepareAccuracyUpdates() {
    const aggregated: number[] = [];
    return merge(
      of(0),
      this.algorithm.resultUpdates$.pipe(map(v => v.accuracy), tap(() => aggregated.length = 0)),
      this.algorithm.singleResultUpdates$.pipe(map(r => {
        aggregated.unshift(r.accuracy);
        if (aggregated.length > this.patternService.maxSize)
          aggregated.length = this.patternService.maxSize;
        let avg = 0;
        for (const v of aggregated) avg += v;
        return avg / aggregated.length;
      }))
    );
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

  startedChanged(isStarted: boolean) {
    if (isStarted)
      this.algorithm.start();
    else
      this.algorithm.stop();
  }
}
