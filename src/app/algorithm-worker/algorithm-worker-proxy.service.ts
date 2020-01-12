import {Injectable, OnDestroy} from "@angular/core";
import {BehaviorSubject, Unsubscribable} from "rxjs";
import {Classifier} from "../algorithms/classifier";
import {GeneticAlgorithmCfg} from "../algorithms/genetic-algorithm/genetic-algorithm-cfg";
import {BucketBrigadeCfg} from "../algorithms/bucket-brigade/bucket-brigade-cfg";
import {MessageConfigProvider} from "../form-view/settings-view/message-config.provider";
import {Alphabet} from "../algorithms/alphabet";
import {Message} from "../algorithms/message/message";
import {PatternService} from "../form-view/settings-view/state-tab/pattern.service";
import {filter, shareReplay} from "rxjs/operators";
import {Matrix} from "../algorithms/matrix";

@Injectable({
  providedIn: "root"
})
export class AlgorithmWorkerProxy implements OnDestroy {
  private patternUpdate: Unsubscribable;
  private readonly worker: Worker;
  private runId = 0;
  private readonly _resultUpdates$ = new BehaviorSubject<AlgorithmResultUpdate>(null);
  readonly resultUpdates$ = this._resultUpdates$.pipe(
    filter(m => m && m.runId === this.runId),
    shareReplay(1)
  );

  constructor(
    private messageConfigProvider: MessageConfigProvider,
    pattern: PatternService
  ) {
    if (typeof Worker !== 'undefined') {
      // Create a new
      this.worker = new Worker('./algorithm.worker', {type: 'module'});
      this.worker.onmessage = ({data}) => this._resultUpdates$.next(data);
      this.patternUpdate = pattern.selectedPattern.subscribe(pattern => this.worker.postMessage({pattern}))
    } else {
      // Web Workers are not supported in this environment.
      // You should add a fallback so that your program still executes correctly.
    }
  }

  updateClassifiers(classifiers: Classifier[]) {
    this.worker.postMessage({classifiers})
  }

  start(gaCfg: GeneticAlgorithmCfg, bbCfg: BucketBrigadeCfg) {
    this.worker.postMessage({gaCfg, bbCfg, msgCfg: this.messageConfigProvider, running: true, runId: this.runId});
  }

  stop() {
    this.worker.postMessage({running: false});
  }

  reset() {
    ++this.runId;
    this.worker.postMessage({runId: this.runId})
  }


  ngOnDestroy(): void {
    if (this.patternUpdate) {
      this.patternUpdate.unsubscribe();
      this.patternUpdate = null;
    }
  }
}

export interface AlgorithmResultUpdate {
  runId: number;
  prediction: Matrix<Alphabet>;
  messages: Message[];
  classifiers: Classifier[];
  accuracy: number;
}
