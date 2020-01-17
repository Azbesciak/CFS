import {BehaviorSubject} from "rxjs";
import {filter, shareReplay} from "rxjs/operators";
import {
  AlgorithmExecutor,
  AlgorithmExecutorMessage,
  AlgorithmResultUpdate,
  ClassifiersUpdate
} from "./algorithm.executor";
import {environment} from "../../environments/environment";

type AlgorithmWorker = AlgorithmExecutor | Worker

export class AlgorithmWorkerProxy {
  private readonly worker: AlgorithmWorker;
  private readonly _resultUpdates$ = new BehaviorSubject<AlgorithmResultUpdate | ClassifiersUpdate>(null);
  readonly resultUpdates$ = this._resultUpdates$.pipe(filter(v => !!v), shareReplay(1));

  constructor() {
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
  }

  postMessage(message: AlgorithmExecutorMessage) {
    this.worker.postMessage(message);
  }
}
