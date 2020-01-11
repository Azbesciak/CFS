import {Component, OnInit} from '@angular/core';
import {Message} from "../algorithms/message";

@Component({
  selector: 'app-form-view',
  templateUrl: './form-view.component.html',
  styleUrls: ['./form-view.component.scss']
})
export class FormViewComponent implements OnInit {
  messages: Message[] = [];//[Message.fromCoords(6, 3), Message.fromCoords(1, 2)];

  constructor() {
  }

  ngOnInit() {
  }

}
