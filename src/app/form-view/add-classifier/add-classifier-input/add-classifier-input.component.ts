import {ChangeDetectionStrategy, Component, Input, ViewEncapsulation} from '@angular/core';
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-add-classifier-input',
  templateUrl: './add-classifier-input.component.html',
  styleUrls: ['./add-classifier-input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddClassifierInputComponent {

  @Input()
  control: FormControl;

  @Input()
  name: string;

}
