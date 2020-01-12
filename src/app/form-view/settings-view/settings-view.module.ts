import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsViewComponent} from "./settings-view.component";
import {MatTabsModule} from "@angular/material/tabs";
import {MatButtonModule} from "@angular/material/button";
import {StateTabComponent} from './state-tab/state-tab.component';
import {GeneticAlgorithmTabComponent} from './genetic-algorithm-tab/genetic-algorithm-tab.component';
import {BucketBrigadeTabComponent} from './bucket-brigade-tab/bucket-brigade-tab.component';
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {MatTooltipModule} from "@angular/material/tooltip";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSliderModule} from "@angular/material/slider";
import {MatInputModule} from "@angular/material/input";
import {GenericFormComponent} from './generic-form/generic-form.component';
import {ClassifiersNumberComponent} from './state-tab/classifiers-number/classifiers-number.component';
import {TranslateModule} from "@ngx-translate/core";


@NgModule({
  declarations: [SettingsViewComponent, StateTabComponent, GeneticAlgorithmTabComponent, BucketBrigadeTabComponent, GenericFormComponent, ClassifiersNumberComponent],
  exports: [SettingsViewComponent],
    imports: [
        CommonModule,
        MatTabsModule,
        MatButtonModule,
        MatIconModule,
        MatSelectModule,
        MatTooltipModule,
        ReactiveFormsModule,
        MatSliderModule,
        MatInputModule,
        TranslateModule
    ]
})
export class SettingsViewModule {
}
