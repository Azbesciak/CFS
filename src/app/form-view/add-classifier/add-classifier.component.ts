import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MessageConfigProvider} from "../settings-view/message-config.provider";
import {AlgorithmService} from "../settings-view/algorithm.service";
import {Classifier} from "../../algorithms/classifier";
import {Alphabet, ALPHABET} from "../../algorithms/alphabet";

const VALID_ALPHABET_VALIDATOR = (field: FormControl) => {
  let value = field.value as string;
  if (!value || value.length === 0) return null;
  if (value.split("").some(v => !ALPHABET.includes(v as Alphabet))) {
    return {
      invalidValue: {allowed: ALPHABET.join(", ")}
    }
  }
};

@Component({
  selector: 'app-add-classifier',
  templateUrl: './add-classifier.component.html',
  styleUrls: ['./add-classifier.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class AddClassifierComponent implements OnInit {
  form: FormGroup;
  conditionControl: FormControl;
  actionControl: FormControl;

  constructor(
    private messagesFactory: MessageConfigProvider,
    private algorithm: AlgorithmService,
    private fb: FormBuilder
  ) {
  }

  private makeControl() {
    return this.fb.control("", [
      Validators.required,
      VALID_ALPHABET_VALIDATOR,
      Validators.maxLength(this.messagesFactory.messageLength),
      Validators.minLength(this.messagesFactory.messageLength)
    ])
  }

  ngOnInit() {
    this.conditionControl = this.makeControl();
    this.actionControl = this.makeControl();
    this.form = this.fb.group({
      "condition": this.conditionControl,
      "action": this.actionControl
    });
  }

  addClassifier() {
    if (this.form.pristine || this.form.invalid) return;
    const {condition, action} = this.form.value;
    this.algorithm.addClassifier(Classifier.fromString(condition, action));
    this.form.reset({});
    this.form.markAsPristine();
    this.actionControl.setErrors(null);
    this.conditionControl.setErrors(null);
  }
}


interface ClassifierModel {
  action: string;
  condition: string;
}

function newClassifierModel(): ClassifierModel {
  return {action: "", condition: ""};
}
