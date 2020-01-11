import {ChangeDetectionStrategy, Component, ViewEncapsulation} from '@angular/core';
import {
  GeneticAlgorithmCfg,
  geneticAlgorithmProperties
} from "../../../algorithms/genetic-algorithm/genetic-algorithm-cfg";
import {AlgorithmService} from "../algorithm.service";

@Component({
  selector: 'app-genetic-algorithm-tab',
  templateUrl: './genetic-algorithm-tab.component.html',
  styleUrls: ['./genetic-algorithm-tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class GeneticAlgorithmTabComponent {
  fields = geneticAlgorithmProperties;

  constructor(private algorithm: AlgorithmService) {
  }

  onValueChange(config: GeneticAlgorithmCfg) {
    this.algorithm.updateGeneticAlgorithm(config);
  }
}
