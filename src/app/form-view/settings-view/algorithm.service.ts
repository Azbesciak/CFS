import {Injectable} from "@angular/core";
import {GeneticAlgorithmCfg} from "../../algorithms/genetic-algorithm/genetic-algorithm-cfg";
import {BucketBrigadeCfg} from "../../algorithms/bucket-brigade/bucket-brigade-cfg";
import {GeneticAlgorithm} from "../../algorithms/genetic-algorithm/genetic-algorithm";
import {BucketBrigade} from "../../algorithms/bucket-brigade/bucket-brigade";
import {BehaviorSubject} from "rxjs";
import {Classifier} from "../../algorithms/classifier";
import {environment} from "../../../environments/environment";
import {MessageConfigProvider} from "./message-config.provider";

@Injectable({
  providedIn: "root"
})
export class AlgorithmService {
  private ga: GeneticAlgorithm;
  private bb: BucketBrigade;
  private readonly messageLength: number;

  constructor(private messageConfigProvider: MessageConfigProvider) {
    this.messageLength = messageConfigProvider.messageLength;
  }

  updateGeneticAlgorithm(cfg: GeneticAlgorithmCfg) {
    if (this.ga)
      this.ga.update(cfg);
    else
      this.ga = new GeneticAlgorithm(cfg, this.messageConfigProvider);
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
    this._isRunning$.next(false);
  }

}
