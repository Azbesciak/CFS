import {NgModule} from "@angular/core";
import {AddClassifierComponent} from "./add-classifier.component";
import {AddClassifierInputComponent} from "./add-classifier-input/add-classifier-input.component";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTooltipModule} from "@angular/material/tooltip";
import {TranslateModule} from "@ngx-translate/core";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";

@NgModule({
  declarations: [AddClassifierComponent, AddClassifierInputComponent],
  exports: [AddClassifierComponent],
  imports: [CommonModule, ReactiveFormsModule, MatIconModule, MatButtonModule, MatTooltipModule, TranslateModule, MatFormFieldModule, MatInputModule]
})
export class AddClassifierModule {}
