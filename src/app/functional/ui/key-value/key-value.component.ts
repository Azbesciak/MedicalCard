import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-key-value',
  templateUrl: './key-value.component.html',
  styleUrls: ['./key-value.component.scss']
})
export class KeyValueComponent implements OnInit {

  constructor() { }

  @Input()
  key: string;
  @Input()
  value: string;

  ngOnInit() {
  }

}
