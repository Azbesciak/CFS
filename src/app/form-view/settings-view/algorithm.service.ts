import {Injectable} from "@angular/core";
import {GeneticAlgorithmCfg} from "../../algorithms/genetic-algorithm/genetic-algorithm-cfg";
import {BucketBrigadeCfg} from "../../algorithms/bucket-brigade/bucket-brigade-cfg";
import {GeneticAlgorithm} from "../../algorithms/genetic-algorithm/genetic-algorithm";
import {BucketBrigade} from "../../algorithms/bucket-brigade/bucket-brigade";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AlgorithmService {
  private ga: GeneticAlgorithm;
  private bb: BucketBrigade;

  private readonly _isRunning = new BehaviorSubject<boolean>(false);
  readonly isStarted = this._isRunning.asObservable();

  updateGeneticAlgorithm(cfg: GeneticAlgorithmCfg) {
    if (this.ga)
      this.ga.update(cfg);
    else
      this.ga = new GeneticAlgorithm(cfg);
  }

  updateBucketBrigade(cfg: BucketBrigadeCfg) {
    if (this.bb)
      this.bb.update(cfg);
    else
      this.bb = new BucketBrigade(cfg);
  }

  start() {
    this._isRunning.next(true);
  }

  stop() {
    this._isRunning.next(false);
  }

  reset() {
    this._isRunning.next(false);
  }

}
