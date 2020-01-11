import {Component, OnInit} from '@angular/core';
import {Message} from "../algorithms/message/message";

@Component({
  selector: 'app-form-view',
  templateUrl: './form-view.component.html',
  styleUrls: ['./form-view.component.scss']
})
export class FormViewComponent implements OnInit {
  messages: Message[] = [];

  constructor() {
  }

  ngOnInit() {
  }

}
