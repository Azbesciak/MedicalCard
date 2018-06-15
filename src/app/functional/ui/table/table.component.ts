import {Component, Input, OnInit} from '@angular/core';
import {Field} from '../../../pages/models';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input('fields')
  fields: Field[];

  @Input('data')
  data: any[];

  @Input('onRowClick')
  onRowClick: (row) => void;

  displayedColumns: string[];
  constructor() { }

  ngOnInit() {
    this.displayedColumns = this.fields.map(f => f.fieldName);
  }

}
