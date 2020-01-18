import {ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ValueConfig} from "../../config";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SliderComponent implements OnInit {

  @Input()
  name: string;

  @Input()
  displayWith: (v: number) => string;

  @Input()
  valueConfig: ValueConfig;

  @Input()
  control: FormControl;

  constructor() {
  }

  ngOnInit() {
  }

}
