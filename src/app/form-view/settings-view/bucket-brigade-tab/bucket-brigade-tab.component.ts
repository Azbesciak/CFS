import {Component} from '@angular/core';
import {AlgorithmService} from "../algorithm.service";
import {BucketBrigadeCfg, bucketBrigadeProperties} from "../../../algorithms/bucket-brigade/bucket-brigade-cfg";

@Component({
  selector: 'app-bucket-brigade-tab',
  templateUrl: './bucket-brigade-tab.component.html',
  styleUrls: ['./bucket-brigade-tab.component.scss']
})
export class BucketBrigadeTabComponent {
  fields = bucketBrigadeProperties;

  constructor(private algorithm: AlgorithmService) {
  }

  onValueChange(config: BucketBrigadeCfg) {
    this.algorithm.updateBucketBrigade(config);
  }
}
