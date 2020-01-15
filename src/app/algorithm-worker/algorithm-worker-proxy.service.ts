import {Injectable, OnDestroy} from "@angular/core";
import {BehaviorSubject, Unsubscribable} from "rxjs";
import {Classifier} from "../algorithms/classifier";
import {GeneticAlgorithmCfg} from "../algorithms/genetic-algorithm/genetic-algorithm-cfg";
import {BucketBrigadeCfg} from "../algorithms/bucket-brigade/bucket-brigade-cfg";
import {MessageConfigProvider} from "../settings-view/message-config.provider";
import {PatternService} from "../state-view/pattern.service";
import {filter, shareReplay} from "rxjs/operators";
import {AlgorithmExecutor, AlgorithmResultUpdate} from "./algorithm.executor";
import {environment} from "../../environments/environment";

type AlgorithmWorker = AlgorithmExecutor | Worker

@Injectable({
  providedIn: "root"
})
export class AlgorithmWorkerProxy implements OnDestroy {
  private patternUpdate: Unsubscribable;
  private readonly worker: AlgorithmWorker;
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
    if (typeof Worker !== 'undefined' && environment.enableWorker) {
      this.worker = new Worker('./algorithm.worker', {type: 'module'});
      this.worker.onmessage = ({data}) => this._resultUpdates$.next(data);
    } else {
      this.worker = new AlgorithmExecutor(
        environment.chess.width,
        environment.chess.height,
        res => this._resultUpdates$.next(res)
      );
    }
    this.patternUpdate = pattern.selectedPattern.subscribe(pattern => this.worker.postMessage({pattern}))
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
