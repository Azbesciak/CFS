import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-algorithm-config-view',
  templateUrl: './algorithm-config-view.component.html',
  styleUrls: ['./algorithm-config-view.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlgorithmConfigViewComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
