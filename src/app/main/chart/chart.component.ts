import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {ChartSeries, ChartValue, Consumption, Granulation} from '../models/models';
import {MatSelectChange} from '@angular/material';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChartComponent implements OnInit {

  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Time';
  showYAxisLabel = true;
  yAxisLabel = 'Consumption [W]';
// line, area
  autoScale = true;
  chartData: ChartSeries[] = [];
  consumptions: Consumption[];

  @Input()
  consumptionsBus: Subject<Consumption[]>;
  currentGranulation: Granulation;

  granulations = [
    new Granulation('Seconds', val => ChartValue.fromTime(val.value, val.name.setMilliseconds(0))),
    new Granulation('Minutes', val => ChartValue.fromTime(val.value, val.name.setSeconds(0, 0))),
    new Granulation('Hour', val => ChartValue.fromTime(val.value, val.name.setMinutes(0, 0, 0))),
    new Granulation('Day', val => ChartValue.fromTime(val.value, val.name.setHours(0, 0, 0, 0))),
    new Granulation('Week', val => {
      const temp = new Date(val.name);
      temp.setHours(0, 0, 0, 0);
      temp.setDate(temp.getDate() - temp.getDay() + 1);
      return new ChartValue(val.value, temp);
    })
  ];
  constructor() {
  }

  onGranulationChange($event: MatSelectChange) {
    this.groupConsumptions(this.consumptions);
  }

   private groupConsumptions(consumptions) {
    this.consumptions = consumptions;
  }

  ngOnInit() {
    this.currentGranulation = this.granulations[2];
    this.consumptionsBus.subscribe(x => this.groupConsumptions(x));
  }

}
