import {Injectable} from "@angular/core";
import {GeneticAlgorithmCfg} from "../algorithms/genetic-algorithm/genetic-algorithm-cfg";
import {BucketBrigadeCfg} from "../algorithms/bucket-brigade/bucket-brigade-cfg";
import {BehaviorSubject, merge, Observable} from "rxjs";
import {Classifier} from "../algorithms/classifier";
import {MessageConfigProvider} from "../form-view/settings-view/message-config.provider";
import {AlgorithmResultUpdate, AlgorithmWorkerProxy} from "./algorithm-worker-proxy.service";
import {filter, map, shareReplay, tap, throttleTime} from "rxjs/operators";
import {Message} from "../algorithms/message/message";

@Injectable({
  providedIn: "root"
})
export class AlgorithmService {
  private gaConfig: GeneticAlgorithmCfg;
  private bbConfig: BucketBrigadeCfg;
  private readonly _isRunning$ = new BehaviorSubject<boolean>(false);
  readonly isStarted$ = this._isRunning$.asObservable();
  private readonly _classifiers$ = new BehaviorSubject<Classifier[]>([]);
  readonly classifiers$: Observable<Classifier[]>;
  private readonly messageLength: number;
  readonly resultUpdates$: Observable<AlgorithmResultUpdate>;
  readonly messages$: Observable<Message[]>;

  constructor(
    private messageConfigProvider: MessageConfigProvider,
    private worker: AlgorithmWorkerProxy
  ) {
    this.resultUpdates$ = worker.resultUpdates$;
    this.classifiers$ = this.makeClassifiersStream();
    this.messages$ = this.makeMessagesStream();
    this.messageLength = messageConfigProvider.messageLength;
  }

  private makeMessagesStream() {
    return this.resultUpdates$.pipe(map(v => v.messages), throttleTime(100), shareReplay(1));
  }

  private makeClassifiersStream() {
    let resultClassifiers = this.resultUpdates$.pipe(
      map(r => r.classifiers.map(Classifier.copy)),
      tap(c => {
        if (c !== this._classifiers$.value)
          this._classifiers$.next(c)
      }),
      throttleTime(100)
    );
    return merge(this._classifiers$, resultClassifiers).pipe(shareReplay(1));
  }

  updateGeneticAlgorithm(cfg: GeneticAlgorithmCfg) {
    this.gaConfig = cfg;
  }

  updateBucketBrigade(cfg: BucketBrigadeCfg) {
    this.bbConfig = cfg;
  }

  addClassifier(classifier: Classifier) {
    let classifiers = this._classifiers$.value.slice();
    classifiers.push(classifier);
    this.updateClassifiers(classifiers);
  }

  updateClassifiersNumber(classifiers: number) {
    const currentClassifiers = this._classifiers$.value.slice();
    if (currentClassifiers.length === classifiers) return;
    if (currentClassifiers.length > classifiers) {
      currentClassifiers.length = classifiers;
    } else {
      while (currentClassifiers.length < classifiers) {
        currentClassifiers.push(Classifier.fromLengths(this.messageLength, this.messageLength));
      }
    }
    this.updateClassifiers(currentClassifiers);
  }

  private updateClassifiers(classifiers: Classifier[]) {
    this._classifiers$.next(classifiers);
    this.worker.updateClassifiers(classifiers);
  }

  start() {
    this._isRunning$.next(true);
    this.worker.start(this.gaConfig, this.bbConfig);
  }

  stop() {
    this._isRunning$.next(false);
    this.worker.stop();
  }

  reset() {
    this._isRunning$.next(false);
  }

}
