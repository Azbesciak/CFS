import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewEncapsulation
} from '@angular/core';
import {
  ConfigValue,
  extractValues,
  FieldDefinition,
  Properties,
  toFieldDefinition,
  ValueType
} from "../../../algorithms/field-definition";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {merge, of, Unsubscribable} from "rxjs";

@Component({
  selector: 'app-generic-form',
  templateUrl: './generic-form.component.html',
  styleUrls: ['./generic-form.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenericFormComponent<T> implements OnDestroy {
  form: FormGroup;
  fieldsDefinitions: FieldDefinition<T>[];
  private formSub: Unsubscribable;

  @Input()
  set config(value: Properties<T, ConfigValue>) {
    this.clearFormSub();
    if (!value) {
      this.fieldsDefinitions = [];
      return;
    }
    this.form = this.fb.group(extractValues(value, (k, v) =>
        [v.defaultValue, [
          Validators.required,
          Validators.min(0.01),
          v.type === ValueType.decimal ? Validators.max(1) : null
        ].filter(v => v)]
      )
    );
    this.fieldsDefinitions = toFieldDefinition(value);
    this.formSub = merge(
      of(this.form.value),
      this.form.valueChanges
    ).subscribe(v => this.form.valid && this.configChange.next(v));
  }

  @Output()
  readonly configChange: EventEmitter<Properties<T, number>> = new EventEmitter();

  constructor(private fb: FormBuilder) {
  }

  ngOnDestroy(): void {
    this.clearFormSub();
  }

  private clearFormSub() {
    if (this.formSub) {
      this.formSub.unsubscribe();
      this.formSub = null;
    }
  }

}
