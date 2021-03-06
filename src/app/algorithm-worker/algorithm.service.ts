import {Injectable, OnDestroy} from "@angular/core";
import {GeneticAlgorithmCfg} from "../algorithms/genetic-algorithm/genetic-algorithm-cfg";
import {BucketBrigadeCfg} from "../algorithms/bucket-brigade/bucket-brigade-cfg";
import {BehaviorSubject, Observable, Unsubscribable} from "rxjs";
import {Classifier} from "../algorithms/classifier";
import {MessageConfigProvider} from "../algorithm-config-view/message-config.provider";
import {AlgorithmWorkerProxy} from "./algorithm-worker-proxy.service";
import {filter, map, shareReplay} from "rxjs/operators";
import {Message} from "../algorithms/message/message";
import {AlgorithmFullResultUpdate, AlgorithmResultUpdate, AlgorithmSingleResultUpdate} from "./algorithm.executor";
import {PatternService} from "../state-view/pattern.service";
import {isArray, isNum} from "../algorithms/utils";

@Injectable({
  providedIn: "root"
})
export class AlgorithmService implements OnDestroy {
  private gaConfig: GeneticAlgorithmCfg;
  private bbConfig: BucketBrigadeCfg;
  private readonly _isRunning$ = new BehaviorSubject<boolean>(false);
  readonly isStarted$ = this._isRunning$.asObservable();
  readonly classifiers$: Observable<Classifier[]>;
  readonly resultUpdates$: Observable<AlgorithmFullResultUpdate>;
  readonly singleResultUpdates$: Observable<AlgorithmSingleResultUpdate>;
  readonly messages$: Observable<Message[]>;
  private readonly worker: AlgorithmWorkerProxy;
  private patternSub: Unsubscribable;

  constructor(
    messageConfigProvider: MessageConfigProvider,
    private patternService: PatternService
  ) {
    this.worker = new AlgorithmWorkerProxy();
    this.worker.postMessage({msgCfg: messageConfigProvider});
    const resultUpdates = this.getResultUpdates$();
    this.resultUpdates$ = this.getFullResultUpdates(resultUpdates);
    this.singleResultUpdates$ = this.getSingleResultUpdate(resultUpdates);
    this.patternSub = this.patternService.selectedPattern.subscribe(p => this.worker.postMessage({pattern: p}));
    this.classifiers$ = this.makeClassifiersStream();
    this.messages$ = this.makeMessagesStream(resultUpdates);
  }

  private getResultUpdates$() {
    return cache(this.worker.resultUpdates$.pipe(
      filter(v => typeof (v as AlgorithmResultUpdate).accuracy === 'number')) as Observable<AlgorithmResultUpdate>
    );
  }

  private getFullResultUpdates(updates: Observable<AlgorithmResultUpdate>) {
    return cache(updates.pipe(
      filter(u => isArray((u as AlgorithmFullResultUpdate).prediction))
    )) as Observable<AlgorithmFullResultUpdate>
  }

  private getSingleResultUpdate(updates: Observable<any>) {
    return cache(updates.pipe(
      filter(u => isNum((u as AlgorithmSingleResultUpdate).x))
    )) as Observable<AlgorithmSingleResultUpdate>
  }

  private makeMessagesStream(results: Observable<AlgorithmResultUpdate>) {
    return cache(results.pipe(map(v => v.messages)));
  }

  private makeClassifiersStream() {
    return cache(this.worker.resultUpdates$.pipe(
      map(r => r.classifiers.map(Classifier.copy)),
    ));
  }

  updateGeneticAlgorithm(cfg: GeneticAlgorithmCfg) {
    this.gaConfig = cfg;
    this.worker.postMessage({gaCfg: cfg});
  }

  updateBucketBrigade(cfg: BucketBrigadeCfg) {
    this.bbConfig = cfg;
    this.worker.postMessage({bbCfg: cfg});
  }

  addClassifier(newClassifier: Classifier) {
    this.worker.postMessage({newClassifier: newClassifier as any});
  }

  removeClassifier(classifierId: number) {
    this.worker.postMessage({removeClassifier: classifierId});
  }

  updateClassifiersNumber(classifiersNumber: number) {
    this.worker.postMessage({classifiersNumber});
  }

  start() {
    this._isRunning$.next(true);
    this.worker.postMessage({running: true});
  }

  stop() {
    this._isRunning$.next(false);
    this.worker.postMessage({running: false});
  }

  reset() {
    this.worker.postMessage({reset: true});
  }

  updateComputationDelay(computationDelay: number) {
    this.worker.postMessage({computationDelay})
  }

  ngOnDestroy(): void {
    if (this.patternSub) {
      this.patternSub.unsubscribe();
      this.patternSub = null;
    }
  }

}

function cache<T>(stream: Observable<T>): Observable<T> {
  return stream.pipe(shareReplay(1));
}
