import {ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {MessageConfigProvider} from "../../algorithm-config-view/message-config.provider";
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
  private focusIn: boolean = false;
  private outTimeout;

  constructor(
    private messagesFactory: MessageConfigProvider,
    private fb: FormBuilder
  ) {
  }

  @Output()
  classifierAdded = new EventEmitter<Classifier>();

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
    this.classifierAdded.next(Classifier.fromString(condition, action));
    this.form.reset({});
    this.form.markAsPristine();
    this.actionControl.setErrors(null);
    this.conditionControl.setErrors(null);
  }

  onFocus() {
    clearTimeout(this.outTimeout);
    if (this.focusIn) return;
    Object.values(this.form.controls).forEach(v => {
      if (!v.value) {
        v.reset(v.value, {emitEvent: false});
      } else {
        v.updateValueAndValidity({onlySelf: false, emitEvent: true});
      }
    });
    this.focusIn = true;
  }

  onFocusOut() {
    this.outTimeout = setTimeout(() => {
      this.focusIn = false;
      if (!this.actionControl.errors && !this.conditionControl.errors) return;
      this.form.reset(this.form.value);
      this.form.markAsPristine();
      this.actionControl.setErrors(null);
      this.conditionControl.setErrors(null);
    })
  }
}
