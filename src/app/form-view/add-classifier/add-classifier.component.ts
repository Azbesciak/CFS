import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-add-classifier',
  templateUrl: './add-classifier.component.html',
  styleUrls: ['./add-classifier.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AddClassifierComponent implements OnInit {
  @ViewChild("form", {static: true})
  form: NgForm;

  @Output()
  classifierAdded = new EventEmitter<ClassifierModel>();

  value: ClassifierModel = newClassifierModel();

  conditionPattern = "[01#]{8}";
  actionPattern = "[01]{8}";

  ngOnInit() {
  }

  addClassifier() {
    if (this.form.invalid || this.form.pristine) return;
    this.classifierAdded.next(this.value);
    this.value = newClassifierModel();
  }
}


interface ClassifierModel {
  action: string;
  condition: string;
}

function newClassifierModel(): ClassifierModel {
  return {action: "", condition: ""};
}
