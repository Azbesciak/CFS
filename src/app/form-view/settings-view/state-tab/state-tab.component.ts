import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Pattern, PatternService} from "./pattern.service";
import {MatSelectChange} from "@angular/material/select";

@Component({
  selector: 'app-state-tab',
  templateUrl: './state-tab.component.html',
  styleUrls: ['./state-tab.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StateTabComponent implements OnInit {
  started = false;
  accuracy = 0;
  pattern: Pattern;
  patterns: Pattern[];

  constructor(private patternService: PatternService) {
  }

  ngOnInit() {
    this.patterns = this.patternService.availablePatterns();
    this.pattern = this.patterns[0];
  }

  start() {
    this.started = true
  }

  stop() {
    this.started = false;
  }

  reset() {
    this.started = false;
  }

  onPatternChanged($event: MatSelectChange) {
    this.pattern = $event.value
  }
}
