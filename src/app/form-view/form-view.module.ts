import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormViewComponent} from './form-view.component';
import {AddClassifierModule} from "./add-classifier/add-classifier.module";
import {ClassifiersListModule} from "./classifiers-list/classifiers-list.module";
import {MessagesViewModule} from "./messages-view/messages-view.module";


@NgModule({
  declarations: [FormViewComponent],
  exports: [FormViewComponent],
  imports: [
    CommonModule,
    AddClassifierModule,
    ClassifiersListModule,
    MessagesViewModule,
  ]
})
export class FormViewModule {
}
