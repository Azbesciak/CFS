import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormViewComponent} from './form-view.component';
import {MessagesViewComponent} from './messages-view/messages-view.component';
import {ClassifiersListComponent} from './classifiers-list/classifiers-list.component';
import {AddClassifierComponent} from './add-classifier/add-classifier.component';
import {MatListModule} from "@angular/material/list";
import {SectionHeaderComponent} from './section-header/section-header.component';
import {NoContentComponent} from './no-content/no-content.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {MatCardModule} from "@angular/material/card";
import {MatTableModule} from "@angular/material/table";
import {SettingsViewModule} from "./settings-view/settings-view.module";


@NgModule({
  declarations: [
    FormViewComponent, MessagesViewComponent,
    ClassifiersListComponent, AddClassifierComponent,
    SectionHeaderComponent, NoContentComponent
  ],
  exports: [
    FormViewComponent
  ],
  imports: [
    CommonModule,
    SettingsViewModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatCardModule,
    MatTableModule
  ]
})
export class FormViewModule {
}
