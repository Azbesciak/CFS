import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AlgorithmService} from "./settings-view/algorithm.service";

@Component({
  selector: 'app-form-view',
  templateUrl: './form-view.component.html',
  styleUrls: ['./form-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormViewComponent implements OnInit {
  constructor(readonly algorithm: AlgorithmService) {
  }

  ngOnInit() {
  }

}
